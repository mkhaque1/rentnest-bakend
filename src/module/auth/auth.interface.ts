import { Role } from '../../../generated/prisma/enums';

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Extract<Role, 'TENANT' | 'LANDLORD'>; // two roles are allowed for registration
  phone?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

export interface IJwtUser {
  id: string;
  role: string;
}
