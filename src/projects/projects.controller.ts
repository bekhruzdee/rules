// import {
//   Controller,
//   Get,
//   Post,
//   Delete,
//   Param,
//   Body,
//   ParseIntPipe,
//   Patch,
//   UseGuards,
//   UseInterceptors,
//   UploadedFile,
// } from '@nestjs/common';
// import { ProjectsService } from './projects.service';
// import { CreateProjectDto } from './dto/create-project.dto';
// import { UpdateProjectDto } from './dto/update-project.dto';
// import { AuthGuard } from 'src/auth/auth.guard';
// import { RolesGuard } from 'src/auth/role.guard';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// @Controller('projects')
// export class ProjectsController {
//   constructor(private readonly projectsService: ProjectsService) {}

//   // @UseGuards(AuthGuard, RolesGuard)
//   // @Post()
//   // create(@Body() createDto: CreateProjectDto) {
//   //   return this.projectsService.create(createDto);
//   // }

//    @UseGuards(AuthGuard, RolesGuard)
//   @Post()
//   @UseInterceptors(FileInterceptor('file', {
//     storage: diskStorage({
//       destination: './uploads', // 📁 uploads papkasiga saqlanadi
//       filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const ext = extname(file.originalname);
//         cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//       },
//     }),
//   }))
//   create(
//     @Body() createDto: CreateProjectDto,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     return this.projectsService.create(createDto, file);
//   }

//   @UseGuards(AuthGuard)
//   @Get()
//   findAll() {
//     return this.projectsService.findAll();
//   }

//   @UseGuards(AuthGuard)
//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.projectsService.findOne(id);
//   }

//   @UseGuards(AuthGuard, RolesGuard)
//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateDto: UpdateProjectDto,
//   ) {
//     return this.projectsService.update(id, updateDto);
//   }

//   @UseGuards(AuthGuard, RolesGuard)
//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.projectsService.remove(id);
//   }
// }


import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/projects',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `project-${uniqueSuffix}${ext}`);
    },
  }),
}))
create(
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File,
) {
  // form-data bilan kelgan stringni arrayga parse qilamiz
  if (typeof body.userIds === 'string') {
    try {
      body.userIds = JSON.parse(body.userIds);
    } catch (err) {
      throw new BadRequestException('Invalid format for userIds');
    }
  }

  return this.projectsService.create(body, file);
}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
