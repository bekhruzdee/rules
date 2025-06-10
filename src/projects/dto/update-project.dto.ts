// import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';
// import { Type } from 'class-transformer';

// export class UpdateProjectDto {
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsArray()
//   @Type(() => Number)
//   @IsInt({ each: true })
//   userIds?: number[];
// }
import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  userIds?: number[]; // bu parse qilingan holatda bo‘lishi kerak
}
