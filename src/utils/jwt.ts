import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

export interface JwtPayload {
  id: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt_access_expires_in as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwt_access_secret, options);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwt_refresh_secret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt_access_secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt_refresh_secret) as JwtPayload;
};
