import { EmailService } from './messanging.types';
import { I18nService } from 'nestjs-i18n';
export declare class MessagingService {
    private emailService;
    private readonly i18n;
    constructor(emailService: EmailService, i18n: I18nService);
    sendRegisterUserEmail(input: {
        from: string;
        to: string;
        name: string;
    }): Promise<void>;
    sendRecoveryPassword(input: {
        from: string;
        to: string;
        url: string;
    }): Promise<void>;
}
