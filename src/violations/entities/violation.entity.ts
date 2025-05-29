import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export enum ViolationLevel {
  MINOR = 'minor',
  MEDIUM = 'medium',
  MAJOR = 'major',
}

@Entity()
export class Violation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.violations, { eager: true })
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