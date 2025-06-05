// update-comment.dto.ts
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  content: string;
}
