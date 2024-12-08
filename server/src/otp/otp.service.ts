import { AppDataSource } from '../db/data-source';
import { OtpType } from './otp.types';
import { Otp } from './otp.entity';
import { User } from '../user/user.entity';

const otpRepository = AppDataSource.getRepository(Otp);

const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createDiscordLinkOtpCode = async () => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  const otp = new Otp();
  const code = generateOtpCode();
  otp.code = code;
  otp.expires_at = date;
  otp.otp_type = OtpType.Discord;
  await otpRepository.save(otp);
  return code;
};

export const findOtpCode = async (code: string, type: OtpType) => {
  if (!code) throw new Error('Something gone wrong');
  const result = await otpRepository.findOne({
    where: { code, otp_type: type },
    relations: {user:true},
  });
  if (result === null) {
    throw new Error('Code not found');
  }
  if (result.expires_at < new Date()) {
    throw new Error('Code expired');
  }
  return result;
};

export const generateKarmaOtpCode = async () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  const otp = new Otp();
  const code = generateOtpCode();
  otp.code = code;
  otp.expires_at = date;
  otp.otp_type = OtpType.Karma;
  await otpRepository.save(otp);
  return code;
};

export const generateChangePassOtpCode = async (user: User) => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  const otp = new Otp();
  const code = generateOtpCode();
  otp.code = code;
  otp.expires_at = date;
  otp.otp_type = OtpType.ChangePassword;
  otp.user = user;
  await otpRepository.save(otp);
  return code;
};

export const deleteOtpCode = async (code: string, type: OtpType) => {
  const result = await otpRepository.delete({ code: code, otp_type: type });
  return Boolean(result.affected);
};
