import { Request, Response } from 'express';
import controllerWrapper from '../decorators/controller-wrapper';
import * as projectService from './project.service';

const createProject = async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json(project);
};

const updateProject = async (req: Request, res: Response) => {
  const project = await projectService.updateProject(
    Number(req.params.projectId),
    req.body,
  );
  res.json(project);
};

const updateProjectStatus = async (req: Request, res: Response) => {
  const project = await projectService.updateProjectStatus(
    Number(req.params.projectId),
    req.body.status,
  );
  res.json(project);
};
const findAllProject = async (req: Request, res: Response) => {
  const project = await projectService.findAllPojects();
  res.json(project);
};

const findProjectById = async (req: Request, res: Response) => {
  const project = await projectService.findProjectById(
    Number(req.params.projectId),
  );
  res.json(project);
};

const endProject = async (req: Request, res: Response) => {
  await projectService.finishProject(Number(req.params.projectId));
  res.json({ status: true });
};

const deleteProject = async (req: Request, res: Response) => {
  await projectService.deleteProject(Number(req.params.projectId));
  res.json({ status: true });
};

export default {
  createProject: controllerWrapper(createProject),
  updateProject: controllerWrapper(updateProject),
  updateProjectStatus: controllerWrapper(updateProjectStatus),
  findAllProject: controllerWrapper(findAllProject),
  findProjectById: controllerWrapper(findProjectById),
  endProject: controllerWrapper(endProject),
  deleteProject: controllerWrapper(deleteProject),
};