import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateProjectDto) {
    if (!createDto.userIds || !Array.isArray(createDto.userIds)) {
      throw new NotFoundException('userIds massiv bo‘lishi kerak');
    }

    const users = await this.userRepository.find({
      where: { id: In(createDto.userIds) },
    });

    const project = this.projectRepository.create({
      name: createDto.name,
      description: createDto.description,
      users,
    });

    const saved = await this.projectRepository.save(project);

    return {
      message: 'Loyiha muvaffaqiyatli yaratildi ✅',
      data: {
        id: saved.id,
        name: saved.name,
        description: saved.description,
        users: saved.users.map((u) => ({
          id: u.id,
          username: u.username,
        })),
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
        users: {
          id: true,
          username: true,
        },
      },
    });

    if (!projects.length) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Hozircha loyiha mavjud emas ⚠️',
        error: 'Not Found',
      });
    }

    return {
      message: 'Loyihalar muvaffaqiyatli olindi ✅',
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
        users: {
          id: true,
          username: true,
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Loyiha topilmadi (id: ${id}) ⚠️`);
    }

    return {
      message: 'Loyiha muvaffaqiyatli topildi ✅',
      data: project,
    };
  }

  async update(id: number, updateDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!project) {
      throw new NotFoundException(`Loyiha topilmadi (id: ${id}) ⚠️`);
    }

    if (updateDto.userIds) {
      if (!Array.isArray(updateDto.userIds)) {
        throw new NotFoundException('userIds massiv bo‘lishi kerak');
      }

      const users = await this.userRepository.find({
        where: { id: In(updateDto.userIds) },
      });

      project.users = users;
    }

    if (updateDto.name !== undefined) project.name = updateDto.name;
    if (updateDto.description !== undefined)
      project.description = updateDto.description;

    const updated = await this.projectRepository.save(project);

    return {
      message: 'Loyiha muvaffaqiyatli yangilandi ✅',
      data: updated,
    };
  }

  async remove(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Loyiha topilmadi (id: ${id}) ⚠️`);
    }

    await this.projectRepository.remove(project);

    return {
      message: 'Loyiha muvaffaqiyatli o‘chirildi ✅',
    };
  }
}
