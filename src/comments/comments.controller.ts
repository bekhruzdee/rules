import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

// @Controller('comments')
// export class CommentsController {
//   constructor(private readonly commentsService: CommentsService) {}

//   @UseGuards(AuthGuard)
//   @Post()
//   create(@Body() dto: CreateCommentDto) {
//     return this.commentsService.create(dto);
//   }

//   @UseGuards(AuthGuard)
//   @Get('/task/:taskId')
//   getByTask(@Param('taskId') taskId: number) {
//     return this.commentsService.findByTask(taskId);
//   }

//   @UseGuards(AuthGuard)
//   @Get('/project/:projectId')
//   getByProject(@Param('projectId') projectId: number) {
//     return this.commentsService.findByProject(projectId);
//   }

//   @UseGuards(AuthGuard)
//   @Patch(':id')
//   update(@Param('id') id: number, @Body() dto: UpdateCommentDto) {
//     return this.commentsService.update(id, dto);
//   }

//   @UseGuards(AuthGuard)
//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.commentsService.remove(id);
//   }
// }
@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get('/task/:taskId')
  getByTask(@Param('taskId') taskId: number) {
    return this.commentsService.findByTask(Number(taskId));
  }

  @Get('/project/:projectId')
  getByProject(@Param('projectId') projectId: number) {
    return this.commentsService.findByProject(Number(projectId));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(Number(id));
  }
}
