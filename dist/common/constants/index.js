"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsConfig = exports.messagingConfig = exports.RoleEnum = void 0;
const env = process.env;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["SUPERADMIN"] = "SUPERADMIN";
    RoleEnum["USER"] = "USER";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
exports.messagingConfig = {
    emailSender: env.EMAIL_SENDER,
    apiKey: env.MAILJET_API_KEY,
    secret: env.MAILJET_SECRET_KEY,
    resetPasswordUrls: {
        backoffice: env.BACKOFFICE_RESET_PASSWORD_URL,
    },
};
exports.awsConfig = {
    client: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION,
    },
    s3: {
        bucket: env.AWS_BUCKET,
    },
};
//# sourceMappingURL=index.js.map