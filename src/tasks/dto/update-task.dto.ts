// export class UpdateTaskDto {
//   title?: string;
//   description?: string;
//   userIds?: number[];
//   completed?: boolean;
// }

import { IsOptional, IsString, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsArray()
  userIds?: number[];
}

