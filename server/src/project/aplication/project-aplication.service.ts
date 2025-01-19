import { AppDataSource } from '../../db/data-source';
import { projectApplicationNotify } from '../../discord/discord';
import { findUserById, getUserDiscord } from '../../user/user.service';
import { addMemberToProject } from '../member/project-member.service';
import { findProjectById } from '../project.service';
import { ProjectAplication } from './project-aplication.entity';
import { ProjectAplicationState } from './project-aplication.enums';
import {
  IProjectAplicationDto,
  IProjectAplicationResolveDto,
} from './project-aplication.types';

const projectAplicationRepositroy =
  AppDataSource.getRepository(ProjectAplication);

export const createProjectApplication = async (
  projectAplicationDto: IProjectAplicationDto,
  userId: number,
) => {
  const project = await findProjectById(projectAplicationDto.projectId);
  if (
    !project.projectRequirments.some(
      (el) => el.tagId === projectAplicationDto.tagId,
    )
  ) {
    throw new Error("Project don't have this tag");
  }
  const isAplicationCreated = await projectAplicationRepositroy.findOne({
    where: {
      projectId: projectAplicationDto.projectId,
      userId,
      state: ProjectAplicationState.WAITING,
    },
  });
  if (isAplicationCreated) {
    throw new Error('Aplication already exist');
  }
  const aplication = await projectAplicationRepositroy.create({
    ...projectAplicationDto,
    userId,
  });
  await projectAplicationRepositroy.save(aplication);
};

export const getProjectAplications = async (projectId: number) => {
  return await projectAplicationRepositroy.find({ where: { projectId } });
};

export const resolveProjectAplication = async (
  projectAplicationResolveDto: IProjectAplicationResolveDto,
) => {
  const project = await findProjectById(projectAplicationResolveDto.projectId);
  const aplication = await projectAplicationRepositroy.findOne({
    where: { id: projectAplicationResolveDto.aplicationId },
  });
  if (!aplication) throw new Error('Not found');
  if (aplication.state != ProjectAplicationState.WAITING)
    throw new Error('Already resolved');
  aplication.state = projectAplicationResolveDto.status;
  if (projectAplicationResolveDto.status === ProjectAplicationState.ACCEPTED) {
    await addMemberToProject({
      projectId: projectAplicationResolveDto.projectId,
      tagId: aplication.tagId,
      userId: aplication.userId,
    });
    await projectApplicationNotify(
      await getUserDiscord(aplication.userId),
      project.name,
      true,
    );
  }
  await projectAplicationRepositroy.save(aplication);
};
