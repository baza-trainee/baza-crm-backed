import { Request, Response } from 'express';
import controllerWrapper from '../decorators/controller-wrapper';

import * as authService from './auth.service';
import { verifyJWT } from '../jwt/jwt.service';
import { existByEmail, findByEmail } from '../user/user.service';
import { getByEmail } from '../user-request/user-request.service';

const register = async (req: Request, res: Response) => {
  const { password } = req.body;
  const code = verifyJWT(req.body.code);
  if (typeof code === 'string') return;
  const email = code.email;
  await existByEmail(email);
  const data = await getByEmail(email);
  const newUser = await authService.userRegistration(email, password);
  res.status(201).json('Success');
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.userLogin(email, password);

  res.json(user);
};

const getMe = async (req: Request, res: Response) => {
  const { id } = req.user;
  const user = await authService.getMe(id);
  return res.json(user);
};

const confirmRegisterCode = async (req: Request, res: Response) => {
  const code = verifyJWT(req.body.code);
  if (typeof code === 'string') return;
  const email = code.email;
  await existByEmail(email);
  const data = await getByEmail(email);
  const { created_at, discord, expired_At, id, isAccepted, ...returnedData } =
    data;
  return res.json({ data: returnedData });
};

const changePassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.changePasswordRequest(email);
  return res.json({ status: true });
};

const changePasswordConf = async (req: Request, res: Response) => {
  const { code, password } = req.body;
  await authService.changePasswordConfirm(code, password);
  return res.json({ status: true });
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getMe: controllerWrapper(getMe),
  confirmRegisterCode: controllerWrapper(confirmRegisterCode),
  changePassword: controllerWrapper(changePassword),
  changePasswordConfirm: controllerWrapper(changePasswordConf),
};
