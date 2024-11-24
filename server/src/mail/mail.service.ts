import nodemailer from 'nodemailer';
import { ILetter } from './mail.types';
import getConfigValue from '../config/config';
import { signJWT } from '../jwt/jwt.service';

const nodemailerConfig = {
  host: getConfigValue('SMTP_HOST'),
  port: getConfigValue('SMTP_PORT'),
  secure: getConfigValue('SMTP_SECURE'),
  auth: {
    user: getConfigValue('SMTP_USER'),
    pass: getConfigValue('SMTP_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const BASE_FRONT_URL = getConfigValue('BASE_FRONT_URL');

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (letter: ILetter) =>
  await transporter.sendMail({ ...letter, from: getConfigValue('SMTP_FROM') });

/* 
TODO
Add queue for proccesing email and discrod jobs
*/

export const sendRegisterEmail = async (email: string) => {
  const jwt = signJWT({ email }, '0.5y');
  const letter = {
    to: email,
    subject: 'Register link',
    html: `<a href='${BASE_FRONT_URL}auth/register?code=${jwt}'> Link </a>`,
  };
  try {
    const result = await sendEmail(letter);
    console.log(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
