import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER, EmailService } from './messanging.types';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MessagingService {
  constructor(@Inject(EMAIL_PROVIDER) private emailService: EmailService, private readonly i18n: I18nService) {}

  async sendRegisterUserEmail(input: { from: string; to: string, name: string }) {
   
    const welcomeMessage = this.i18n.t('messages.welcomeMessage', {
      args: { platform: "ApiRestNest"},
    });

    const { from, to, name } = input;
    const subject = welcomeMessage;
    const body = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡${welcomeMessage}!</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">¡${welcomeMessage}!</h2>
        <p>${this.i18n.t('messages.hi')} ${name},</p>
        <p>${this.i18n.t('messages.welcomeMessageBody')}</p>
       
        <p>${this.i18n.t('messages.messageBody')}</p>
        <p>${this.i18n.t('messages.finallyMessageBody')}</p>
    </div>
</body>
</html>`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }

  async sendRecoveryPassword(input: { from: string; to: string; url: string }) {
    const { from, to, url } = input;
    const subject = this.i18n.t('messages.messageActionRecoveryPassword');
    const body = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.i18n.t('messages.messageActionRecoveryPassword')}</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">${this.i18n.t('messages.messageActionRecoveryPassword')}</h2>
        <p>${this.i18n.t('messages.hi')},</p>
        <p>${this.i18n.t('messages.messageRecoveryPassword')}</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">${this.i18n.t('messages.messageActionRecoveryPassword')}</a>
        <p>${this.i18n.t('messages.ignoreMessageBody')}</p>
        <p>${this.i18n.t('messages.finallyMessageBody')}</p>
    </div>
</body>
</html>`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }
}
