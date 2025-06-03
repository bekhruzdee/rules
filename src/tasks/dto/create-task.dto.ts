// export class CreateTaskDto {
//   title: string;
//   description?: string;
//   projectId: number;
//   userIds: number[];
// }

import { IsString, IsOptional, IsArray, IsEnum, IsNumber } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  projectId: number;

  @IsArray()
  userIds: number[];

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
