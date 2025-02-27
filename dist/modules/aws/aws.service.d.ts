export declare class AwsService {
    private s3Client;
    private logger;
    constructor();
    uploadFile(file: Express.Multer.File, userId: string): Promise<{
        url: string;
        key: string;
    }>;
    deleteFile(fileKey: string): Promise<void>;
}
