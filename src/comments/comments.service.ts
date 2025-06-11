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

// @Injectable()
// export class CommentsService {
//   constructor(
//     @InjectRepository(Comment)
//     private readonly commentRepository: Repository<Comment>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,

//     @InjectRepository(Task)
//     private readonly taskRepo: Repository<Task>,

//     @InjectRepository(Project)
//     private readonly projectRepository: Repository<Project>,
//   ) {}

//   async create(dto: CreateCommentDto) {
//     const user = await this.userRepository.findOne({
//       where: { id: dto.userId },
//     });
//     if (!user) throw new NotFoundException('Author not found');

//     const comment = new Comment();
//     comment.content = dto.content;
//     comment.author = user;

//     if (dto.taskId) {
//       const task = await this.taskRepo.findOne({ where: { id: dto.taskId } });
//       if (!task) throw new NotFoundException('Task not found');
//       comment.task = task;
//     } else if (dto.projectId) {
//       const project = await this.projectRepository.findOne({
//         where: { id: dto.projectId },
//       });
//       if (!project) throw new NotFoundException('Project not found');
//       comment.project = project;
//     } else {
//       throw new BadRequestException('Either taskId or projectId is required');
//     }

//     const saved = await this.commentRepository.save(comment);

//     const withRelations = await this.commentRepository.findOne({
//       where: { id: saved.id },
//       relations: [
//         'author',
//         'task',
//         'task.project',
//         'task.assignedUsers',
//         'project',
//       ],
//     });

//     return {
//       message: 'Comment added successfully ✅',
//       data: instanceToPlain(withRelations),
//     };
//   }

//   async findByTask(taskId: number) {
//     const comments = await this.commentRepository.find({
//       where: { task: { id: taskId } },
//       relations: ['author'],
//       order: { created_at: 'ASC' },
//     });

//     return {
//       message: 'Comments for task',
//       data: comments.map((c) => instanceToPlain(c)),
//     };
//   }

//   async findByProject(projectId: number) {
//     const comments = await this.commentRepository.find({
//       where: { project: { id: projectId } },
//       relations: ['author'],
//       order: { created_at: 'ASC' },
//     });

//     return {
//       message: 'Comments for project',
//       data: comments.map((c) => instanceToPlain(c)),
//     };
//   }

//   async update(id: number, dto: UpdateCommentDto) {
//     const comment = await this.commentRepository.findOne({ where: { id } });
//     if (!comment) throw new NotFoundException('Comment not found');

//     comment.content = dto.content;
//     const updated = await this.commentRepository.save(comment);

//     const withRelations = await this.commentRepository.findOne({
//       where: { id: updated.id },
//       relations: ['author'],
//     });

//     return {
//       message: 'Comment updated ✅',
//       data: instanceToPlain(withRelations),
//     };
//   }

//   async remove(id: number) {
//     const comment = await this.commentRepository.findOne({ where: { id } });
//     if (!comment) throw new NotFoundException('Comment not found');

//     await this.commentRepository.remove(comment);
//     return { message: 'Comment deleted ✅' };
//   }
// }

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(dto: CreateCommentDto) {
    const user = await this.findUserOrThrow(dto.userId);

    const comment = this.commentRepo.create({
      content: dto.content,
      author: user,
    });

    if (dto.taskId) {
      comment.task = await this.findTaskOrThrow(dto.taskId);
    } else if (dto.projectId) {
      comment.project = await this.findProjectOrThrow(dto.projectId);
    } else {
      throw new BadRequestException('taskId or projectId is required.');
    }

    const saved = await this.commentRepo.save(comment);
    return this.findByIdWithRelations(saved.id, 'Comment added successfully ✅');
  }

  async findByTask(taskId: number) {
    const comments = await this.commentRepo.find({
      where: { task: { id: taskId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });

    return {
      message: 'Comments for task',
      data: instanceToPlain(comments),
    };
  }

  async findByProject(projectId: number) {
    const comments = await this.commentRepo.find({
      where: { project: { id: projectId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });

    return {
      message: 'Comments for project',
      data: instanceToPlain(comments),
    };
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');

    comment.content = dto.content;
    const updated = await this.commentRepo.save(comment);

    return this.findByIdWithRelations(updated.id, 'Comment updated ✅');
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentRepo.remove(comment);
    return { message: 'Comment deleted ✅' };
  }

  // 🔁 Reusable helpers
  private async findUserOrThrow(userId: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Author not found');
    return user;
  }

  private async findTaskOrThrow(taskId: number): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private async findProjectOrThrow(projectId: number): Promise<Project> {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  private async findByIdWithRelations(id: number, message: string) {
    const data = await this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'task', 'task.project', 'task.assignedUsers', 'project'],
    });

    return { message, data: instanceToPlain(data) };
  }
}
