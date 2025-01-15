import { AppDataSource } from '../db/data-source';
import { sendKarmaReviewLink } from '../discord/discord';
import { signJWT } from '../jwt/jwt.service';
import { generateKarmaOtpCode } from '../otp/otp.service';
import { Project } from '../project/project.entity';
import { findUserById, saveUser } from '../user/user.service';
import { Karma } from './karma.entity';
import { IKarma } from './karma.types';

const projectRepository = AppDataSource.getRepository(Project);
const karmaRepository = AppDataSource.getRepository(Karma);

export const sendKarmaUsers = async (projectId: number, fromId: number) => {
  const res = await projectRepository.findOne({
    where: { id: projectId },
    relations: { projectMember: { user: true } },
    select: {
      id: true,
      name: true,
    },
  });
  if (res === null) {
    return;
  }
  const obj: any = {};
  obj.project = { id: res.id, name: res.name };
  const members = res.projectMember.map((el) => {
    const obj: any = {};
    obj.tagId = el.tagId;
    obj.user = {
      id: el.user.id,
      firstName: el.user.firstName,
      lastName: el.user.lastName,
    };
    return obj;
  });
  obj.members = members.filter((el) => el.user.id != fromId);
  return obj;
};

export const sendKarmaReviewLinks = async (projectId: number) => {
  const res = await projectRepository.findOne({
    where: { id: projectId },
    relations: { projectMember: { user: true } },
    select: {
      id: true,
      name: true,
    },
  });
  if (res === null) throw new Error('Project not found');
  await Promise.all(
    res.projectMember.map(async (el) => {
      if (el.user.discord) {
        const jwt = signJWT(
          {
            userId: el.user.id,
            projectId: el.projectId,
            code: await generateKarmaOtpCode(),
          },
          '14d',
        );
        await sendKarmaReviewLink(String(el.user.discord), jwt);
      }
    }),
  );
};

export const setKarmas = async (
  projectId: number,
  userId: number,
  karmas: IKarma[],
) => {
  const project = await projectRepository.findOne({
    where: { id: projectId },
    relations: { projectMember: true },
  });
  if (project === null) throw new Error('Project not found');
  const membersIds = project.projectMember.map((el) => el.userId);
  const isAllInProject = karmas.every((el) => membersIds.includes(el.userId));
  if (!isAllInProject) throw new Error('Not all members belongs to project');
  const karmaMembersSet = new Set();
  karmas.forEach((el) => karmaMembersSet.add(el.userId));
  if (karmaMembersSet.size !== karmas.length)
    throw new Error('Some ids passed multiple times');
  const data = karmas.map((el) => {
    return karmaRepository.create({
      points: el.points,
      karmaGiverId: userId,
      karmaReceiverId: el.userId,
      projectId,
    });
  });
  await karmaRepository.save(data);
  for(const user of karmaMembersSet){
    await recalculateKarmaPoints(Number(user))
  }
};

export const recalculateKarmaPoints = async (userId: number) => {
  const karmas = await karmaRepository.find({
    where: { karmaReceiverId: userId },
  });
  let karmaPoints = 0;
  for (const karma of karmas) {
    karmaPoints += karma.points;
  }
  karmaPoints = Number((karmaPoints / karmas.length).toFixed(1));
  const user = await findUserById(userId);
  user.karmaPoints = karmaPoints;
  await saveUser(user);
};
