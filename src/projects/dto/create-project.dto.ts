// import { IsNumber, IsString } from 'class-validator';

// export class CreateProjectDto {
//   @IsString()
//   name: string;

//   @IsString()
//   description?: string;
 
//   userIds: number[];
// }

// import { IsNotEmpty, IsOptional } from 'class-validator';

// export class CreateProjectDto {
//   @IsNotEmpty()
//   name: string;

//   @IsOptional()
//   description?: string;

//   @IsOptional()
//   userIds?: number[];
// }

import { IsString, IsOptional, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  userIds: number[];
}
