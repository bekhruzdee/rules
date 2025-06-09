import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getDashboard(@Query('period') period?: 'monthly' | 'yearly') {
    return await this.dashboardService.getStatistics(period);
  }
}
