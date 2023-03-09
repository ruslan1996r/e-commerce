import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

import { MailService } from './MailService';
import { MailHtmlService } from './MailHtmlService';
import { Config } from '@root/config';
import { MAIL_SERVICE } from '@root/constants';

@Module({
  providers: [
    MailService,
    MailHtmlService,
    ConfigService,
    {
      provide: MAIL_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const oauth2Client: OAuth2Client = new google.auth.OAuth2(
          configService.get(Config.GOOGLE_MAIL_ID),
          configService.get(Config.GOOGLE_MAIL_SECRET),
          configService.get(Config.GOOGLE_MAIL_REDIRECT_URL),
        );
        oauth2Client.setCredentials({
          refresh_token: configService.get(Config.GOOGLE_MAIL_REFRESH_TOKEN),
        });
        return oauth2Client;
      },
    },
  ],
  exports: [MailService],
})
export class MailModule {}
