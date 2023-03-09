import { Injectable } from '@nestjs/common';

import { UserEntity } from '@root/database/entities';

@Injectable()
export class MailHtmlService {
  buildAuthHtml(user: UserEntity) {
    const html = `
      <h1>${user.name}, thank you for registering!</h1>
    `;
    return html;
  }

  buildPurchaseHtml(product: any, user: any) {
    const html = `
      <h1>${user.name}, thank you for your purchase!</h1>
    `;
    return html;
  }
}
