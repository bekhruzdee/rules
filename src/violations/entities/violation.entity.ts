import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Transform } from 'class-transformer';
import moment from 'moment-timezone';

export enum ViolationLevel {
  MINOR = 'minor',
  MEDIUM = 'medium',
  MAJOR = 'major',
}

@Entity()
export class Violation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.violations, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: ViolationLevel })
  level: ViolationLevel;

  @Column()
  description: string;

  @Column()
  penaltyPoints: number;

  @CreateDateColumn()
  createdAt: Date;
}
