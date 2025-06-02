import { Project } from 'src/projects/entities/project.entity';
import { Violation } from 'src/violations/entities/violation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: `varchar` })
  username: string;
  @Column({ type: `varchar` })
  password: string;
  @Column({ type: 'varchar', default: 'user' })
  role: string;
  @OneToMany(() => Violation, (violation) => violation.user)
  violations: Violation[];
  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
