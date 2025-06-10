// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, In } from 'typeorm';
// import { Project } from './entities/project.entity';
// import { User } from 'src/users/entities/user.entity';
// import { CreateProjectDto } from './dto/create-project.dto';
// import { UpdateProjectDto } from './dto/update-project.dto';

// @Injectable()
// export class ProjectsService {
//   constructor(
//     @InjectRepository(Project)
//     private readonly projectRepository: Repository<Project>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   // async create(createDto: CreateProjectDto) {
//   //   if (!createDto.userIds || !Array.isArray(createDto.userIds)) {
//   //     throw new NotFoundException('userIds must be an array');
//   //   }

//   //   const users = await this.userRepository.find({
//   //     where: { id: In(createDto.userIds) },
//   //   });

//   //   const project = this.projectRepository.create({
//   //     name: createDto.name,
//   //     description: createDto.description,
//   //     users,
//   //   });

//   //   const saved = await this.projectRepository.save(project);

//   //   return {
//   //     message: 'Project created successfully ✅',
//   //     data: {
//   //       id: saved.id,
//   //       name: saved.name,
//   //       description: saved.description,
//   //       users: saved.users.map((u) => ({
//   //         id: u.id,
//   //         username: u.username,
//   //       })),
//   //       createdAt: saved.created_at,
//   //     },
//   //   };
//   // }


//   async create(createDto: CreateProjectDto, file?: Express.Multer.File) {
//   if (!createDto.userIds || !Array.isArray(createDto.userIds)) {
//     throw new NotFoundException('userIds must be an array');
//   }

//   const users = await this.userRepository.find({
//     where: { id: In(createDto.userIds) },
//   });

//   const project = this.projectRepository.create({
//     name: createDto.name,
//     description: createDto.description,
//     users,
//     imagePath: file?.filename, // Fayl nomini saqlaymiz
//   });

//   const saved = await this.projectRepository.save(project);

//   return {
//     message: 'Project created successfully ✅',
//     data: {
//       id: saved.id,
//       name: saved.name,
//       description: saved.description,
//       imagePath: saved.imagePath
//         ? `uploads/projects/${saved.imagePath}`
//         : null,
//       users: saved.users.map((u) => ({
//         id: u.id,
//         username: u.username,
//       })),
//       createdAt: saved.created_at,
//     },
//   };
// }

//   async findAll() {
//     const projects = await this.projectRepository.find({
//       relations: ['users'],
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         users: {
//           id: true,
//           username: true,
//         },
//       },
//     });

//     if (!projects.length) {
//       throw new NotFoundException({
//         statusCode: 404,
//         message: 'No projects found ⚠️',
//         error: 'Not Found',
//       });
//     }

//     return {
//       message: 'Projects retrieved successfully ✅',
//       data: projects,
//     };
//   }

//   async findOne(id: number) {
//     const project = await this.projectRepository.findOne({
//       where: { id },
//       relations: ['users'],
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         users: {
//           id: true,
//           username: true,
//         },
//       },
//     });

//     if (!project) {
//       throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
//     }

//     return {
//       message: 'Project retrieved successfully ✅',
//       data: project,
//     };
//   }

//   async update(id: number, updateDto: UpdateProjectDto) {
//     const project = await this.projectRepository.findOne({
//       where: { id },
//       relations: ['users'],
//     });

//     if (!project) {
//       throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
//     }

//     let users = project.users;

//     if (updateDto.userIds) {
//       if (!Array.isArray(updateDto.userIds)) {
//         throw new NotFoundException('userIds must be an array');
//       }

//       users = await this.userRepository.find({
//         where: { id: In(updateDto.userIds) },
//         select: ['id', 'username'],
//       });

//       if (!users.length) {
//         throw new NotFoundException('No valid users found for given userIds');
//       }

//       project.users = users;
//     }

//     if (updateDto.name !== undefined) project.name = updateDto.name;
//     if (updateDto.description !== undefined)
//       project.description = updateDto.description;

//     const updated = await this.projectRepository.save(project);

//     return {
//       message: 'Project updated successfully ✅',
//       data: {
//         id: updated.id,
//         name: updated.name,
//         description: updated.description,
//         createdAt: updated.created_at,
//         users: users.map((u) => ({
//           id: u.id,
//           username: u.username,
//         })),
//       },
//     };
//   }

//   async remove(id: number) {
//     const project = await this.projectRepository.findOne({ where: { id } });

//     if (!project) {
//       throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
//     }

//     await this.projectRepository.remove(project);

//     return {
//       message: 'Project deleted successfully ✅',
//     };
//   }
// }


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

  async create(createDto: CreateProjectDto, file?: Express.Multer.File) {
    const users = await this.userRepository.find({
      where: { id: In(createDto.userIds) },
    });

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
        imagePath: saved.imagePath ? `uploads/projects/${saved.imagePath}` : null,
        users: saved.users.map(u => ({ id: u.id, username: u.username })),
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

  async update(id: number, updateDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!project) {
      throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
    }

    let users = project.users;

    if (updateDto.userIds) {
      users = await this.userRepository.find({
        where: { id: In(updateDto.userIds) },
      });
    }

    project.name = updateDto.name ?? project.name;
    project.description = updateDto.description ?? project.description;
    project.users = users;

    const updated = await this.projectRepository.save(project);

    return {
      message: 'Project updated successfully ✅',
      data: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        users: users.map(u => ({ id: u.id, username: u.username })),
        createdAt: updated.created_at,
      },
    };
  }

  async remove(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project not found (id: ${id}) ⚠️`);
    }

    await this.projectRepository.remove(project);

    return {
      message: 'Project deleted successfully ✅',
    };
  }
}
