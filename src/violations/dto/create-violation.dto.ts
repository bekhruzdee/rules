import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ViolationLevel } from '../entities/violation.entity';

export class CreateViolationDto {
  @IsNumber()
  userId: number;

  @IsEnum(ViolationLevel)
  level: ViolationLevel;

  @IsNotEmpty()
  description: string;
}