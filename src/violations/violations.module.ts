import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViolationsService } from './violations.service';
import { ViolationsController } from './violations.controller';
import { Violation } from './entities/violation.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Violation, User])],
  controllers: [ViolationsController],
  providers: [ViolationsService],
})
export class ViolationsModule {}
