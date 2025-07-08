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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

//          Fayl turini tanlamaydi      //

// const multerOptions = FileInterceptor('file', {
//   storage: diskStorage({
//     destination: './uploads/projects',
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const ext = extname(file.originalname);
//       cb(null, `project-${uniqueSuffix}${ext}`);
//     },
//   }),
// });

//    Fayl turi tanlaydi faqat belgilangan faylarni  qo'shish mumkin      //

const multerOptions = FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/projects',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `project-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      '.jpg',
      '.jpeg',
      '.png',
      '.pdf',
      '.doc',
      '.docx',
      '.txt',
    ];
    const ext = extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Fayl turi ruxsat etilmagan!'), false);
    }
  },
});

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(multerOptions)
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.projectsService.create(body, file);
  }

  @Get('count')
  async getProjectsCount() {
    const count = await this.projectsService.countProjects();
    return { total: count };
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
  @UseInterceptors(multerOptions)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.update(id, body, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
