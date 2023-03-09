import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE } from '@root/constants';

export type AuthType = 'google' | 'local';

export const GoogleAuthDecorator = (auth_type: AuthType) => {
  return SetMetadata(AUTH_TYPE, auth_type);
};
