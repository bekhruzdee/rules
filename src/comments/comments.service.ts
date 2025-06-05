import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Project } from 'src/projects/entities/project.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(dto: CreateCommentDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('Author not found');

    const comment = new Comment();
    comment.content = dto.content;
    comment.author = user;

    if (dto.taskId) {
      const task = await this.taskRepo.findOne({ where: { id: dto.taskId } });
      if (!task) throw new NotFoundException('Task not found');
      comment.task = task;
    } else if (dto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: dto.projectId },
      });
      if (!project) throw new NotFoundException('Project not found');
      comment.project = project;
    } else {
      throw new BadRequestException('Either taskId or projectId is required');
    }

    const saved = await this.commentRepository.save(comment);

    const withRelations = await this.commentRepository.findOne({
      where: { id: saved.id },
      relations: ['author', 'task', 'task.project', 'task.assignedUsers', 'project'],
    });

    return {
      message: 'Comment added successfully ✅',
      data: instanceToPlain(withRelations),
    };
  }

  async findByTask(taskId: number) {
    const comments = await this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['author'],
      order: { created_at: 'ASC' },
    });

    return {
      message: 'Comments for task',
      data: comments.map((c) => instanceToPlain(c)),
    };
  }

  async findByProject(projectId: number) {
    const comments = await this.commentRepository.find({
      where: { project: { id: projectId } },
      relations: ['author'],
      order: { created_at: 'ASC' },
    });

    return {
      message: 'Comments for project',
      data: comments.map((c) => instanceToPlain(c)),
    };
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    comment.content = dto.content;
    const updated = await this.commentRepository.save(comment);

    const withRelations = await this.commentRepository.findOne({
      where: { id: updated.id },
      relations: ['author'],
    });

    return {
      message: 'Comment updated ✅',
      data: instanceToPlain(withRelations),
    };
  }

  async remove(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted ✅' };
  }
}
