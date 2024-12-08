import { Router } from 'express';
import validator from '../validator/validator';
import {
  changePasswordRequestSchema,
  confirmCodeSchema,
  createUserSchema,
  loginUserSchema,
} from './auth.schemas';
import authController from './auth.controller';
import { getUserJWT } from '../shared/middlewares/getUserJWT';

const authRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Auth information
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: register
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               code: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *               password: adminTestPass
 *     responses:
 *       200:
 *         description: Ok
 */
authRouter.post(
  '/register',
  validator({ body: createUserSchema }),
  authController.register,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *             example:
 *               email: admin@gmail.com
 *               password: adminTestPass
 *     responses:
 *       200:
 *         description: Ok
 */
authRouter.post(
  '/login',
  validator({ body: loginUserSchema }),
  authController.login,
);

/**
 * @openapi
 * /auth/confirmRegisterCode:
 *   post:
 *     summary: Confirm code from email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 required: true
 *             example:
 *               code: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *     responses:
 *       200:
 *         description: Ok
 */
authRouter.post(
  '/confirmRegisterCode',
  validator({ body: confirmCodeSchema }),
  authController.confirmRegisterCode,
);

/**
 * @openapi
 * /auth/me:
 *   post:
 *     summary: login
 *     tags: [Auth]
 *     security:
 *       - jwtheader: []
 *     responses:
 *       200:
 *         description: Ok
 */
authRouter.post('/me', getUserJWT, authController.getMe);

/**
 * @openapi
 * /auth/changepassword:
 *   post:
 *     summary: Change password request
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *             example:
 *               email: admin@gmail.com
 *     responses:
 *       200:
 *         description: Ok
 */
authRouter.post(
  '/changepassword',
  validator({ body: changePasswordRequestSchema }),
  authController.changePassword,
);

/**
 * @openapi
 * /auth/changepasswordconfirm:
 *   post:
 *     summary: Change password confirm
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 required: true
 *               code:
 *                 type: string
 *                 required: true
 *             example:
 *               password: Test1234
 *               code: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *     responses:
 *       200:
 *         description: Ok
 */
authRouter.post(
  '/changepasswordconfirm',
  validator({ body: createUserSchema }),
  authController.changePasswordConfirm,
);

export default ['auth', authRouter];
