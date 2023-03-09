import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@root/config';
import { OAuth2Client } from 'googleapis-common';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

import { MAIL_SERVICE } from '@root/constants';
import { UserEntity } from './../database/entities';
import { MailHtmlService } from './MailHtmlService';

@Injectable()
export class MailService {
  private readonly logger: Logger = new Logger(MailService.name);
  constructor(
    @Inject(MAIL_SERVICE) private readonly oauth2Client: OAuth2Client,
    private readonly configService: ConfigService,
    private readonly mailHtmlService: MailHtmlService,
  ) {}

  private async buildTransport() {
    const accessToken = await this.oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get(Config.GOOGLE_MAIL_SENDER),
        clientId: this.configService.get(Config.GOOGLE_MAIL_ID),
        clientSecret: this.configService.get(Config.GOOGLE_MAIL_SECRET),
        refreshToken: this.configService.get(Config.GOOGLE_MAIL_REFRESH_TOKEN),
        accessToken: accessToken.token,
      },
    });
  }

  async registerMail(user: UserEntity) {
    try {
      const transport = await this.buildTransport();

      const mailOptions: Options = {
        from: this.configService.get(Config.GOOGLE_MAIL_SENDER),
        to: user.email,
        subject: 'Thank you for registering!',
        html: this.mailHtmlService.buildAuthHtml(user),
        // text: '',
      };

      const result = await transport.sendMail(mailOptions);
      this.logger.log(
        { messageId: result.messageId, accepted: result.accepted },
        'Mail/Register',
      );
      return result;
    } catch (error) {
      this.logger.error(error, 'Mail/Register');
    }
  }

  async successPurchaseMail(product: any, user: any) {
    this.mailHtmlService.buildPurchaseHtml(product, user);
  }
}
