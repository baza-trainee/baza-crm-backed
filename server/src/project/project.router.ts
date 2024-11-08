import { Router } from 'express';
import validator from '../validator/validator';

import { getUserJWT } from '../shared/middlewares/getUserJWT';

import { isAdmin } from '../shared/middlewares/isAdmin';
import projectController from './project.controller';
import * as projectSchemas from './project.schemas';
import { projectRequirmentRouter } from './requirment/project-requirment.router';
import { projectAplicationRouter } from './aplication/project-aplication.router';
import { projectMemberRouter } from './member/project-member.router';

const projectRouter = Router();
projectRouter.use(getUserJWT);

projectRouter.use('/:projectId/aplication/', projectAplicationRouter);
projectRouter.use('/:projectId/member/', projectMemberRouter);

/**
 * @openapi
 * tags:
 *   name: Project
 *   description: Project information
 */

/**
 * @openapi
 * /project/:
 *   get:
 *     summary: get project
 *     tags: [Project]
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
projectRouter.get('/', projectController.findAllProject);

/**
 * @openapi
 * /project/{projectId}:
 *   get:
 *     summary: get project by id
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
projectRouter.get(
  '/:projectId',
  validator({ params: projectSchemas.projectIdParamSchema }),
  projectController.findProjectById,
);

projectRouter.use(isAdmin);

/**
 * @openapi
 * /project:
 *   post:
 *     summary: createProject
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               projectPoints:
 *                 type: number
 *               projectType:
 *                 type: string
 *                 enum:
 *                   - free
 *                   - light
 *                   - strong
 *               price:
 *                 type: number
 *               dateStart:
 *                 type: string
 *               dateTeam:
 *                 type: string
 *             example:
 *               description: text
 *               name: text
 *               projectPoints: 5
 *               projectType: free
 *               price: 0
 *               dateStart: 08/17/2024
 *               dateTeam: 09/17/2024
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
projectRouter.post(
  '/',
  validator({
    body: projectSchemas.createProjectSchema,
  }),
  projectController.createProject,
);

/**
 * @openapi
 * /project/{projectId}/status:
 *   patch:
 *     summary: get project by id
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *             example:
 *               status: searching
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
projectRouter.patch(
  '/:projectId/status',
  validator({
    params: projectSchemas.projectIdParamSchema,
    body: projectSchemas.updateProjectStatusSchema,
  }),
  projectController.updateProjectStatus,
);

/**
 * @openapi
 * /project/{projectId}:
 *   patch:
 *     summary: get project by id
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               projectPoints:
 *                 type: number
 *               projectType:
 *                 type: string
 *                 enum:
 *                   - free
 *                   - light
 *                   - strong
 *               price:
 *                 type: number
 *               dateStart:
 *                 type: string
 *               dateTeam:
 *                 type: string
 *               links:
 *                 type: array
 *                 items:
 *                   type: stirng
 *               documents:
 *                 type: array
 *                 items: 
 *                   type: object
 *                   properties:
 *                     name:
 *                       type:string
 *                     link:
 *                       type:string
 *             example:
 *               description: text
 *               name: text
 *               projectPoints: 5
 *               projectType: free
 *               price: 0
 *               dateStart: 08/17/2024
 *               dateTeam: 09/17/2024
 *               links: ["test.com","localhost.com"]
 *               documents: [{"name":"figma","link":"https://goole.com"}]
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
projectRouter.patch(
  '/:projectId',
  validator({
    params: projectSchemas.projectIdParamSchema,
    body: projectSchemas.updateProjectSchema,
  }),
  projectController.updateProject,
);

/**
 * @openapi
 * /project/finish/{projectId}:
 *   post:
 *     summary: Set project as ended
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
projectRouter.post(
  '/finish/:projectId',
  validator({ params: projectSchemas.projectIdParamSchema }),
  projectController.endProject,
);

/**
 * @openapi
 * /project/{projectId}:
 *   delete:
 *     summary: Delete project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
projectRouter.delete(
  '/:projectId',
  validator({ params: projectSchemas.projectIdParamSchema }),
  projectController.deleteProject,
);

projectRouter.use('/:projectId/requirment/:tagId', projectRequirmentRouter);

export default ['project', projectRouter];
