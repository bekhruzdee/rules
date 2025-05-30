import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ViolationsService } from './violations.service';
import { CreateViolationDto } from './dto/create-violation.dto';

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

  @Get('summary/:userId')
  getSummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.violationsService.getUserPenaltySummary(userId);
  }

  @Get('history/:userId')
  getHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.violationsService.getUserViolationHistory(userId);
  }
}
