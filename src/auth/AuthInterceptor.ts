import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type * as Passport from 'passport';
import { Request, Response } from 'express';

import { AUTH_TYPE } from '@root/constants';

export class AuthInterceptor implements NestInterceptor {
  readonly logger: Logger = new Logger(AuthInterceptor.name);
  readonly reflector: Reflector;
  readonly passport: Passport.Authenticator;

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const auth_type = this.reflector.get(AUTH_TYPE, context.getHandler());

    if (!auth_type) {
      throw new Error('Please, provide "auth_type"');
    }

    this.logger.verbose(auth_type, 'AuthInterceptorType');

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    request.user = await this.authenticate(auth_type, request, response);

    return next.handle();
  }

  private async authenticate(
    auth_type: string,
    request: Request,
    response: Response,
  ) {
    return new Promise<void>((resolve, reject) => {
      this.passport.authenticate(
        auth_type,
        { scope: ['profile', 'email', 'openid'] },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (err, user, _info, _status) => {
          try {
            return resolve(this.handleRequest(err, user));
          } catch (err) {
            this.logger.error(err, 'GOOGLE_AUTH: ');
            reject(err);
          }
        },
      )(request, response);
    });
  }

  private handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
