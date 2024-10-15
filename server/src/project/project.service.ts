import { AppDataSource } from '../db/data-source';
import { sendKarmaReviewLinks } from '../karma/karma.service';
import { addUserPoints } from '../user/user.service';
import { Project } from './project.entity';
import { ProjectStatuses } from './project.enums';
import { IProjectCreate, IProjectUpdate } from './project.types';

const projectRepository = AppDataSource.getRepository(Project);

export const findAllPojects = async () => {
  // TODO add caching
  const projects = await projectRepository.find({
    relations: { projectRequirments: true, projectMember: true },
  });
  return projects;
};

export const findProjectById = async (id: number) => {
  const project = await projectRepository.findOne({
    where: { id },
    relations: { projectRequirments: true, projectMember: true },
  });
  if (project === null) throw new Error('Project not found');
  return project;
};

export const createProject = async (createProjectDto: IProjectCreate) => {
  const newProject = await projectRepository.create(createProjectDto);
  await projectRepository.save(newProject);
  return newProject.id;
};

export const updateProject = async (
  id: number,
  updateProjectDto: IProjectUpdate,
) => {
  if (updateProjectDto.documents) {
    try {
      updateProjectDto.documents = JSON.stringify(updateProjectDto.documents);
    } catch (e) {
      throw new Error('Documents format wrong');
    }
  }
  await findProjectById(id);
  await projectRepository.update({ id }, updateProjectDto);
  return await findProjectById(id);
};

export const updateProjectStatus = async (
  id: number,
  status: ProjectStatuses,
) => {
  await findProjectById(id);
  if (status === ProjectStatuses.ENDED)
    throw new Error('Finish project not in this route');
  await projectRepository.update({ id }, { projectStatus: status });
  return await findProjectById(id);
};

export const finishProject = async (projectId: number) => {
  const project = await findProjectById(projectId);
  if (project.projectStatus === ProjectStatuses.ENDED)
    throw new Error('Project already finished');
  // TODO ADD TRANSACTION
  // TODO Add recalculation karmas
  project.projectStatus = ProjectStatuses.ENDED;
  await projectRepository.save(project);
  await addUserPoints(project);
  await sendKarmaReviewLinks(projectId);
};
