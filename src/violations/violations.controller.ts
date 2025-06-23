import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ViolationsService } from './violations.service';
import { CreateViolationDto } from './dto/create-violation.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('violations')
export class ViolationsController {
  constructor(private readonly violationsService: ViolationsService) {}

  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createDto: CreateViolationDto,
  ) {
    return this.violationsService.create(userId, createDto);
  }

  @Get('/count')
  @UseGuards(AuthGuard)
  async countMyViolations(@Req() req: any) {
    const userId = req.user.id;
    return this.violationsService.countByUser(userId);
  }

  @Get('summary/:userId')
  getSummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.violationsService.getUserPenaltySummary(userId);
  }

  @Get('history/:userId')
  getHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.violationsService.getUserViolationHistory(userId);
  }
}
