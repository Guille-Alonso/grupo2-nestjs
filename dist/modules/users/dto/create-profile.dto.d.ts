export declare class CreateProfileDto {
    address: string;
    phone: string;
}
declare const UpdateProfileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProfileDto>>;
export declare class UpdateProfileDto extends UpdateProfileDto_base {
}
export {};
