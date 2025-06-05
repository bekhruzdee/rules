import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.projects, { cascade: true })
  @JoinTable()
  users: User[];
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.project)
comments: Comment[];


  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
