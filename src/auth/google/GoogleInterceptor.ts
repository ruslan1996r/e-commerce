import { Injectable, Inject } from '@nestjs/common';
import type * as Passport from 'passport';
import { Reflector } from '@nestjs/core';

import { GOOGLE_SERVICE } from '@root/constants';
import { AuthInterceptor } from '../AuthInterceptor';

@Injectable()
export class GoogleInterceptor extends AuthInterceptor {
  constructor(
    @Inject(GOOGLE_SERVICE) readonly passport: Passport.Authenticator,
    readonly reflector: Reflector,
  ) {
    super();
  }
}
