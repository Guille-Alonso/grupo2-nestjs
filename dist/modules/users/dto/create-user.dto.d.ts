import { RoleEnum } from 'src/common/constants';
export declare class CreateUserDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleEnum;
}
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
