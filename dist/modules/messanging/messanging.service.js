"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const messanging_types_1 = require("./messanging.types");
const nestjs_i18n_1 = require("nestjs-i18n");
let MessagingService = class MessagingService {
    constructor(emailService, i18n) {
        this.emailService = emailService;
        this.i18n = i18n;
    }
    async sendRegisterUserEmail(input) {
        const welcomeMessage = this.i18n.t('messages.welcomeMessage', {
            args: { platform: "ApiRestNest" },
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
    async sendRecoveryPassword(input) {
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
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(messanging_types_1.EMAIL_PROVIDER)),
    __metadata("design:paramtypes", [Object, nestjs_i18n_1.I18nService])
], MessagingService);
//# sourceMappingURL=messanging.service.js.map