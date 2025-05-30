import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ViolationLevel } from '../entities/violation.entity';

export class CreateViolationDto {
  @IsEnum(ViolationLevel)
  level: ViolationLevel;

  @IsNotEmpty()
  description: string;
}
