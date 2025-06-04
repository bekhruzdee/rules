import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Task, TaskStatus } from 'src/tasks/entities/task.entity';
import { Violation } from 'src/violations/entities/violation.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Violation)
    private readonly violationRepository: Repository<Violation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getStatistics(period?: 'monthly' | 'yearly') {
    try {
      const now = new Date();
      let startDate: Date | undefined;

      if (period === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (period === 'yearly') {
        startDate = new Date(now.getFullYear(), 0, 1);
      }

      const projectCount = await this.projectRepository.count();
      const totalTasks = await this.taskRepository.count();
      const activeTasks = await this.taskRepository.count({
        where: { status: TaskStatus.TODO },
      });
      const doneTasks = await this.taskRepository.count({
        where: { status: TaskStatus.DONE },
      });

      let violationData: { userId: number; count: string } | undefined;

      if (startDate) {
        violationData = await this.violationRepository
          .createQueryBuilder('v')
          .select('v.userId', 'userId')
          .addSelect('COUNT(*)', 'count')
          .where('v.createdAt >= :startDate', { startDate })
          .groupBy('v.userId')
          .orderBy('count', 'DESC')
          .limit(1)
          .getRawOne();
      } else {
        violationData = await this.violationRepository
          .createQueryBuilder('v')
          .select('v.userId', 'userId')
          .addSelect('COUNT(*)', 'count')
          .groupBy('v.userId')
          .orderBy('count', 'DESC')
          .limit(1)
          .getRawOne();
      }

      let topViolator: {
        id: number;
        username: string;
        violations: number;
      } | null = null;

      if (violationData?.userId) {
        const user = await this.userRepo.findOne({
          where: { id: violationData.userId },
        });

        if (user) {
          topViolator = {
            id: user.id,
            username: user.username,
            violations: parseInt(violationData.count, 10),
          };
        }
      }

      return {
        httpStatusCode: HttpStatus.OK,
        message: 'Dashboard statistics retrieved successfully ✅',
        data: {
          period: period ?? 'overall',
          projectCount,
          taskStats: {
            total: totalTasks,
            active: activeTasks,
            done: doneTasks,
          },
          topViolator,
        },
      };
    } catch (error) {
      console.error('Failed to load dashboard statistics ❌', error);
      return {
        httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve dashboard statistics ❌',
        data: null,
        error: error?.message ?? 'Unknown error occurred',
      };
    }
  }
}
