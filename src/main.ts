import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ express tipi

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // ✅ express app yaratish

  app.useGlobalPipes(new ValidationPipe());

  // ✅ uploads papkasini static qilish
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
