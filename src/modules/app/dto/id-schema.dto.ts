import { IsUUID } from 'class-validator';

export class IdParamDto {
  @IsUUID('4', { message: 'El campo id debe ser un UUID válido' })
  id: string;
}
