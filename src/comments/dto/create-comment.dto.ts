import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsNumber()
  userId: number;

  @ValidateIf((o) => !o.projectId)
  @IsNumber()
  taskId?: number;

  @ValidateIf((o) => !o.taskId)
  @IsNumber()
  projectId?: number;
}
