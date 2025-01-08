import Joi from 'joi';
import { IProjectCreate, IProjectUpdate } from './project.types';
import { ProjectStatuses, ProjectTypes } from './project.enums';

export const projectIdParamSchema = Joi.object({
  projectId: Joi.string().required(),
});

export const createProjectSchema = Joi.object<IProjectCreate>({
  description: Joi.string().required(),
  name: Joi.string().required(),
  projectPoints: Joi.number().required(),
  projectType: Joi.string()
    .valid(...Object.values(ProjectTypes))
    .required(),
  price: Joi.number().required(),
  dateStart: Joi.string().optional(),
  dateTeam: Joi.string().optional(),
});

export const updateProjectSchema = Joi.object<IProjectUpdate>({
  description: Joi.string().optional(),
  name: Joi.string().optional(),
  projectPoints: Joi.number().optional(),
  projectType: Joi.string()
    .valid(...Object.values(ProjectTypes))
    .optional(),
  price: Joi.number().optional(),
  dateTeam: Joi.string().optional(),
  dateStart: Joi.string().optional(),
  links: Joi.array().optional(),
  documents: Joi.array()
    .items({
      name: Joi.string().required(),
      link: Joi.string().required(),
    })
    .optional(),
});

export const updateProjectStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ProjectStatuses))
    .required(),
});

export const discordLinkSchema = Joi.object({
  guildId: Joi.string().required(),
  projectId: Joi.string().required(),
});
