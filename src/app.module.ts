import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ViolationsModule } from './violations/violations.module';
import { Violation } from './violations/entities/violation.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Violation],
      synchronize: true,
      // logging: true,
    }),
    AuthModule,
    UserModule,
    ViolationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
