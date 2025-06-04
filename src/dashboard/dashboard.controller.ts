import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Query('period') period?: 'monthly' | 'yearly') {
    return await this.dashboardService.getStatistics(period);
  }
}
