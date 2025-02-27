export declare enum RoleEnum {
    SUPERADMIN = "SUPERADMIN",
    USER = "USER"
}
export declare const messagingConfig: {
    emailSender: string;
    apiKey: string;
    secret: string;
    resetPasswordUrls: {
        backoffice: string;
    };
};
export declare const awsConfig: {
    readonly client: {
        readonly accessKeyId: string;
        readonly secretAccessKey: string;
        readonly region: string;
    };
    readonly s3: {
        readonly bucket: string;
    };
};
