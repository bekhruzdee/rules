import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Violation, ViolationLevel } from './entities/violation.entity';
import { CreateViolationDto } from './dto/create-violation.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ViolationsService {
  constructor(
    @InjectRepository(Violation)
    private violationRepository: Repository<Violation>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private getPointsForLevel(level: ViolationLevel): number {
    switch (level) {
      case ViolationLevel.MINOR:
        return 1;
      case ViolationLevel.MEDIUM:
        return 2;
      case ViolationLevel.MAJOR:
        return 3;
    }
  }

  async create(userId: number, createDto: CreateViolationDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'role', 'created_at', 'updated_at'],
    });

    if (!user) throw new NotFoundException('User not found⚠️');

    const penaltyPoints = this.getPointsForLevel(createDto.level);

    const violation = this.violationRepository.create({
      user,
      level: createDto.level,
      description: createDto.description,
      penaltyPoints,
    });

    const savedViolation = await this.violationRepository.save(violation);

    return {
      success: true,
      message: 'Violation recorded successfully✅',
      data: savedViolation,
    };
  }

  async getUserPenaltySummary(userId: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.violations', 'violation')
      .select([
        'user.id',
        'user.username',
        'violation.id',
        'violation.level',
        'violation.description',
        'violation.penaltyPoints',
        'violation.createdAt',
      ])
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) throw new NotFoundException('User not found⚠️');

    const totalPoints = user.violations.reduce(
      (sum, v) => sum + v.penaltyPoints,
      0,
    );

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      totalPenaltyPoints: totalPoints,
      violations: user.violations,
      actions: totalPoints >= 12 ? '⚠️ Maoshdan ushlab qolinadi' : '✅ OK',
    };
  }

  async getUserViolationHistory(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'username'],
    });
    if (!user) throw new NotFoundException('User not found⚠️');

    const violations = await this.violationRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'level', 'description', 'penaltyPoints', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    return {
      user,
      totalViolations: violations.length,
      history: violations,
    };
  }
}
