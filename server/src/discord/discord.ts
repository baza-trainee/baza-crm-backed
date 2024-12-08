import {
  Client,
  GatewayIntentBits,
  Partials,
  ChannelType,
  Guild,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from 'discord.js';
import getConfigValue from '../config/config';
import { createDiscordLinkOtpCode } from '../otp/otp.service';
import { signJWT } from '../jwt/jwt.service';
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

const roles = [
  { name: 'Back', color: '0000ff' },
  { name: 'Front', color: 'ff0000' },
  { name: 'Design', color: 'ffa500' },
  { name: 'Qa', color: 'ffff00' },
];

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

const addRolesToUser = async (
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
};

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
      `${getConfigValue('BASE_URL')}/user/discord/?code=${signJWT(
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

const initNewChannel = async (guild: Guild) => {
  if (!(guild instanceof Guild)) return;
  const avaliableRoles: string[] = [];
  guild.roles.cache.forEach((el) => avaliableRoles.push(el.name));
  roles.forEach(async (el) => {
    if (avaliableRoles.includes(el.name)) return;
    await guild.roles.create({ color: `#${el.color}`, name: el.name });
  });
  guild.channels.cache.forEach(async (el) => {
    await el.delete();
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
      `${
        getConfigValue('BASE_FRONT_URL') + 'auth/changepassword?data=' + code
      }`,
    )
    .setStyle(ButtonStyle.Link);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
  await user.send({
    content: `Press the button below to change password`,
    components: [row],
  });
};

// const sendUsersInvitations = async (guildId: string, userId: string) => {
//   const guildData = (() => {})();
//   const users = userId;
//   const guild = await client.guilds.cache.find((el) => el.id == guildId);
//   const members = await guild.members.fetch();
//   const user = await client.users.fetch(String(userId));
//   const channel = await guild.channels.cache.find(
//     (el) => el.type == ChannelType.GuildText && el.name == 'загальний',
//   );
//   const invite = await guild.invites.create(channel, {
//     maxUses: 1,
//     unique: true,
//     maxAge: '3600',
//   });
//   await user.send(invite.url);
// };

client.on('ready', async () => {});

client.on('messageCreate', async (ctx) => {
  if (ctx.author.bot) return;
  if (ctx.guild) return;
  if (ctx.content.startsWith('/start')) {
    await sendUserAuthButton(ctx.author.id);
  }
  console.log(ctx);
});

client.on('guildMemberAdd', async (member) => {
  await sendUserAuthButton(member.id);
});

client.on('guildCreate', async (guild) => {
  console.log(guild.name + ' connected');
  if (guild.id == mainGuildId) return;
  await initNewChannel(guild);
});

export default client;
