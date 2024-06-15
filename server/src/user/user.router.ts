import { Router } from 'express';
import validator from '../validator/validator';
import * as UserSchema from './user.schemas';
import userController from './user.controller';
import { getUserJWT } from '../shared/middlewares/getUserJWT';

const userRouter = Router();
userRouter.use(getUserJWT);

/**
 * @openapi
 * tags:
 *   name: User
 *   description: User information
 */

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Get user information
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
userRouter.get(
  '/:id',
  validator({ params: UserSchema.getUserByIdParamSchema }),
  userController.findUserById,
);

/**
 * @openapi
 * /user:
 *   patch:
 *     summary: Update user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkedin:
 *                 type: string
 *               emailReceiving:
 *                 type: boolean
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               linkedin: linkedinUrl
 *               emailReceiving: false
 *               city: Lviv
 *               country: Ukraine
 *               firstName: Adam
 *               lastName: Smasher
 *               phone: +380 96 53 43 12 34
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
userRouter.patch(
  '/',
  validator({ body: UserSchema.updateUserSchema }),
  userController.updateUser,
);

/**
 * @openapi
 * /user/discord:
 *   post:
 *     summary: Link discord user
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: Discord userId
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
userRouter.post(
  '/discord/',
  validator({ query: UserSchema.linkDiscordSchema }),
  userController.linkDiscord,
);

export default ['user', userRouter];
