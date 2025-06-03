import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto) {
    const { title, description, projectId, userIds, status } = dto;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project)
      throw new NotFoundException(`Project not found (id: ${projectId})`);

    if (!Array.isArray(userIds))
      throw new BadRequestException('userIds must be an array');

    const users = userIds.length
      ? await this.userRepository.find({ where: { id: In(userIds) } })
      : [];

    const task = this.taskRepository.create({
      title,
      description,
      project,
      assignedUsers: users,
      status: status ?? TaskStatus.TODO,
      completed: false,
    });

    const saved = await this.taskRepository.save(task);
    return this.formatTask(saved);
  }

  async findAll() {
    const tasks = await this.taskRepository.find();
    const grouped: Record<TaskStatus, any[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };

    for (const task of tasks) {
      grouped[task.status].push(this.formatTaskData(task));
    }

    return {
      message: 'All tasks grouped by Kanban status ✅',
      data: grouped,
    };
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task not found (id: ${id})`);
    return this.formatTask(task);
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task not found (id: ${id})`);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.completed !== undefined) task.completed = dto.completed;

    if (dto.userIds) {
      if (!Array.isArray(dto.userIds)) {
        throw new BadRequestException('userIds must be an array');
      }
      const users = await this.userRepository.find({
        where: { id: In(dto.userIds) },
      });
      task.assignedUsers = users;
    }

    const updated = await this.taskRepository.save(task);
    return this.formatTask(updated);
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task not found (id: ${id})`);

    await this.taskRepository.remove(task);
    return { message: 'Task successfully deleted ✅' };
  }

  private formatTask(task: Task) {
    return {
      message: 'Task operation successful ✅',
      data: this.formatTaskData(task),
    };
  }

  private formatTaskData(task: Task) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      completed: task.completed,
      project: {
        id: task.project?.id,
        name: task.project?.name,
      },
      assignedUsers:
        task.assignedUsers?.map((u) => ({
          id: u.id,
          username: u.username,
        })) || [],
      created_at: task.created_at,
      updated_at: task.updated_at,
    };
  }
}
