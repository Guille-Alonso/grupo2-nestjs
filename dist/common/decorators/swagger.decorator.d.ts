interface ApiCustomOperationOptions {
    summary: string;
    bodyType?: any;
    responseStatus?: number;
    responseDescription?: string;
}
export declare function ApiCustomOperation(options: ApiCustomOperationOptions): (target: any, key: string, descriptor: PropertyDescriptor) => void;
export {};
