import {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
  Guild,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Colors,
} from 'discord.js';
import getConfigValue from '../config/config';
import { createDiscordLinkOtpCode } from '../otp/otp.service';
import { signJWT } from '../jwt/jwt.service';
import { findProjectByDiscordId } from '../project/project.service';
import { getAllTags } from '../tag/tag.service';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message],
});

const mainGuildId = getConfigValue('GUILD_DISCORD_ID');
const guildsOwnerId = getConfigValue('GUILD_OWNER_ID');

const getAllRoles = async () => {
  const tags = await getAllTags();
  return tags.map((el) => ({ name: el.name, color: el.color }));
};

const parentChannels = ['Текстові канали', 'Голосові канали'];
const channels = [
  'Загальний',
  'back',
  'front',
  'design',
  'qa',
  'документи-і-записи',
];
const voiceChannels = [
  'Загальний',
  'Кімната 1',
  'Кімната 2',
  'Кімната 3',
  'Кімната 4',
];

/* const addRolesToUser = async (
  roleName: string,
  userId: string,
  guildId: string,
) => {
  const guild = await client.guilds.cache.find((el) => el.id == guildId);
  if (!guild) {
    throw new Error('Guild not found');
  }
  const role = guild.roles.cache.find(
    (el) => el.name.toLowerCase() == roleName.toLowerCase(),
  );
  if (!role) {
    throw new Error('Role not found');
  }
  const users = await guild.members.fetch();
  const user = await users.find((el) => el.user.id == userId);
  if (!user) {
    throw new Error('User not found');
  }
  await user.roles.add(role);
}; */

const kickUser = async (userId: string, guildId: string) => {
  const guild = await client.guilds.cache.find((el) => el.id == guildId);
  if (!guild) {
    throw new Error('Guild not found');
  }
  const users = await guild.members.fetch();
  const user = await users.find((el) => el.user.id == userId);
  if (!user) {
    throw new Error('User not found');
  }
  await user.kick();
};

const sendUserAuthButton = async (userId: string) => {
  const code = await createDiscordLinkOtpCode();
  const button = new ButtonBuilder()
    .setLabel('Authorize')
    .setURL(
      `${getConfigValue(
        'BASE_FRONT_URL',
      )}crm/connect-to-discord?token=${signJWT(
        { code, discordId: userId },
        '24h',
      )}`,
    )
    .setStyle(ButtonStyle.Link);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  const user = await client.users.fetch(userId);

  await user.send({
    content: `Press the button below to authorize you`,
    components: [row],
  });
};

const createRole = async (guild: Guild, name: string, color: string) => {
  if (color && color.startsWith('#')) {
    await guild.roles.create({ color: `#${color.slice(1)}`, name });
  } else {
    await guild.roles.create({ color: 'Random', name });
  }
};

const initNewChannel = async (guild: Guild) => {
  if (!(guild instanceof Guild)) return;
  const avaliableRoles: string[] = [];
  guild.roles.cache.forEach((el) => avaliableRoles.push(el.name));
  const roles = await getAllRoles();
  roles.forEach(async (el) => {
    if (avaliableRoles.includes(el.name)) return;
    await createRole(guild, el.name, el.color);
  });
  const parentTextChannel = await guild.channels.create({
    type: ChannelType.GuildCategory,
    name: parentChannels[0],
  });
  const parentVoiceChannel = await guild.channels.create({
    type: ChannelType.GuildCategory,
    name: parentChannels[1],
  });
  channels.forEach(async (chnl) => {
    await guild.channels.create({
      type: ChannelType.GuildText,
      name: chnl,
      parent: parentTextChannel,
    });
  });
  voiceChannels.forEach(async (chnl) => {
    await guild.channels.create({
      type: ChannelType.GuildVoice,
      name: chnl,
      parent: parentVoiceChannel,
    });
  });
  console.log(guild.name + ' inited');
};

export const sendKarmaReviewLink = async (userId: string, code: string) => {
  const user = await client.users.fetch(String(userId));

  const button = new ButtonBuilder()
    .setLabel('Authorize')
    .setURL(
      `${getConfigValue('BASE_FRONT_URL') + 'crm/evaluating?data=' + code}`,
    )
    .setStyle(ButtonStyle.Link);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
  await user.send({
    content: `Press the button below to set karmas`,
    components: [row],
  });
};

export const sendChangePasswordLink = async (userId: string, code: string) => {
  const user = await client.users.fetch(String(userId));

  const button = new ButtonBuilder()
    .setLabel('Authorize')
    .setURL(
      `${getConfigValue('BASE_FRONT_URL') + 'reset-password/?data=' + code}`,
    )
    .setStyle(ButtonStyle.Link);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
  await user.send({
    content: `Press the button below to change password`,
    components: [row],
  });
};

export const sendUserInvitations = async (guildId: string, userId: string) => {
  const guild = await client.guilds.cache.find((el) => el.id == guildId);
  if(!guild) return
  const user = await client.users.fetch(String(userId));
  const channel = await guild.channels.cache.find(
    (el) => el.type == ChannelType.GuildText && el.name == 'загальний',
  );
  if(!channel) return
  const invite = await guild.invites.create(channel.id, {
    maxUses: 1,
    unique: true,
    maxAge: 604800,
  });
  await user.send(invite.url);
};

client.on('ready', async () => {});

client.on('messageCreate', async (ctx) => {
  if (ctx.author.bot) return;
  if (ctx.guild) return;
  if (ctx.content.startsWith('/start')) {
    await sendUserAuthButton(ctx.author.id);
  }
});

client.on('guildMemberAdd', async (guildMember) => {
  const guildId = guildMember.guild.id;
  if (guildId === mainGuildId) return;
  const userId = guildMember.id;
  const project = await findProjectByDiscordId(guildId);
  if (!project) return;
  const member = project.projectMember.find((el) => el.user.discord == userId);
  if (!member) return;
  let role = guildMember.guild.roles.cache.find(
    (el) => el.name.toLowerCase() === member?.tag.name.toLowerCase(),
  );
  if (!role) {
    await createRole(guildMember.guild, member.tag.name, member.tag.color);
  }
  if (!role) return;
  await guildMember.roles.add(role);
});

client.on('guildCreate', async (guild) => {
  console.log(guild.name + ' connected');
  if (guild.id == mainGuildId) return;
  // if (guild.ownerId !== guildsOwnerId) await guild.leave();
  await initNewChannel(guild);
});

export default client;
