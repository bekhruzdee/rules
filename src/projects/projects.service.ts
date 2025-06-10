import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private parseUserIds(userIds: any): number[] {
    if (typeof userIds === 'string') {
      try {
        const parsed = JSON.parse(userIds.trim());
        if (
          !Array.isArray(parsed) ||
          parsed.some((id) => typeof id !== 'number')
        ) {
          throw new Error();
        }
        return parsed;
      } catch {
        throw new BadRequestException(
          'Invalid format for userIds. Must be JSON array of integers.',
        );
      }
    } else if (
      Array.isArray(userIds) &&
      userIds.every((id) => typeof id === 'number')
    ) {
      return userIds;
    } else if (!userIds) {
      return [];
    } else {
      throw new BadRequestException(
        'Invalid format for userIds. Must be JSON array of integers.',
      );
    }
  }
  async create(createDto: CreateProjectDto, file?: Express.Multer.File) {
    const userIds = this.parseUserIds(createDto.userIds);

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });

    const foundIds = users.map((u) => u.id);
    const notFoundIds = userIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length) {
      throw new NotFoundException(
        `Users not found with IDs: ${notFoundIds.join(', ')}`,
      );
    }

    const project = this.projectRepository.create({
      name: createDto.name,
      description: createDto.description,
      users,
      imagePath: file?.filename || null,
    });

    const saved = await this.projectRepository.save(project);

    return {
      message: 'Project created successfully ✅',
      data: {
        id: saved.id,
        name: saved.name,
        description: saved.description,
        imagePath: saved.imagePath
          ? `uploads/projects/${saved.imagePath}`
          : null,
        users: saved.users.map((u) => ({ id: u.id, username: u.username })),
        createdAt: saved.created_at,
      },
    };
  }

  async findAll() {
    const projects = await this.projectRepository.find({
      relations: ['users'],
      select: {
        id: true,
        name: true,
        description: true,
        imagePath: true,
        users: { id: true, username: true },
      },
    });

    if (!projects.length) {
      throw new NotFoundException('No projects found ⚠️');
    }

    return {
      message: 'Projects retrieved successfully ✅',
      data: projects,
    };
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
      select: {
        id: true,
        name: true,
        description: true,
        imagePath: true,
        users: { id: true, username: true },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
    }

    return {
      message: 'Project retrieved successfully ✅',
      data: project,
    };
  }

  async update(
    id: number,
    updateDto: UpdateProjectDto,
    file?: Express.Multer.File,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!project) {
      throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
    }

    const userIds = this.parseUserIds(updateDto.userIds);
    let users = project.users;

    if (userIds.length > 0) {
      users = await this.userRepository.find({ where: { id: In(userIds) } });

      const foundIds = users.map((u) => u.id);
      const notFoundIds = userIds.filter((id) => !foundIds.includes(id));

      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `Users not found with IDs: ${notFoundIds.join(', ')}`,
        );
      }
    }

    if (file && project.imagePath) {
      const oldImagePath = path.join(
        process.cwd(),
        'uploads/projects',
        project.imagePath,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    project.name = updateDto.name ?? project.name;
    project.description = updateDto.description ?? project.description;
    project.users = users;
    if (file) {
      project.imagePath = file.filename;
    }

    const updated = await this.projectRepository.save(project);

    return {
      message: 'Project updated successfully ✅',
      data: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        imagePath: updated.imagePath
          ? `uploads/projects/${updated.imagePath}`
          : null,
        users: users.map((u) => ({ id: u.id, username: u.username })),
        createdAt: updated.created_at,
      },
    };
  }

  async remove(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
    }

    if (project.imagePath) {
      const filePath = path.join(
        process.cwd(),
        'uploads/projects',
        project.imagePath,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.projectRepository.remove(project);

    return {
      message: 'Project deleted successfully ✅',
    };
  }
}
