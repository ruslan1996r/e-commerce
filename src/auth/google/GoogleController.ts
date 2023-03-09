import {
  Controller,
  Get,
  Session,
  Request,
  UseInterceptors,
  Response,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';

import { GoogleAuthDecorator as UseAuth } from './GoogleAuthDecorator';
import { GoogleInterceptor } from './GoogleInterceptor';
import { GoogleService } from './GoogleService';

@Controller('google')
export class GoogleController {
  constructor(private googleService: GoogleService) {}

  @Get('login')
  @UseAuth('google')
  @UseInterceptors(GoogleInterceptor)
  login() {
    console.log('GOOGLE_LOGIN...');
    return { login: true };
  }

  @Get('callback')
  @UseAuth('google')
  @UseInterceptors(GoogleInterceptor)
  async callback(
    @Request() req: RequestType & { user: any },
    @Response() res: ResponseType,
    @Session() session: Record<string, any>,
  ) {
    // console.log('req.user', req.user);
    const reqUser = req.user?.profile?._json || null;

    const { user, token } = await this.googleService.login(reqUser);

    session.user = user;

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.send({
      ...user,
      token,
    });
  }
}
