import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ViolationsService } from './violations.service';
import { CreateViolationDto } from './dto/create-violation.dto';

@Controller('violations')
export class ViolationsController {
  constructor(private readonly violationsService: ViolationsService) {}

  @Post()
  create(@Body() createDto: CreateViolationDto) {
    return this.violationsService.create(createDto);
  }

  @Get('summary/:userId')
  getSummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.violationsService.getUserPenaltySummary(userId);
  }
}