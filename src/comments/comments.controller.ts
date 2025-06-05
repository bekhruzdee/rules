import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get('/task/:taskId')
  getByTask(@Param('taskId') taskId: number) {
    return this.commentsService.findByTask(taskId);
  }

  @Get('/project/:projectId')
  getByProject(@Param('projectId') projectId: number) {
    return this.commentsService.findByProject(projectId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
