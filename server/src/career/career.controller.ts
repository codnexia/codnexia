// Career endpoints - public POST for applications, protected GET/PATCH/DELETE for admin
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CareerService } from './career.service';
import { CreateCareerApplicationDto } from './dto/create-career-application.dto';
import { UpdateCareerStatusDto } from './dto/update-career-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('careers')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  // Public - anyone can submit an application (3 per hour)
  @Throttle({ strict: { ttl: 3600000, limit: 3 } })
  @Post()
  create(@Body() dto: CreateCareerApplicationDto) {
    return this.careerService.create(dto);
  }

  // Admin only - view paginated applications
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.careerService.findAll(pagination.page, pagination.limit);
  }

  // Admin only - view single application details
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.findOne(id);
  }

  // Admin only - update application status
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCareerStatusDto,
  ) {
    return this.careerService.updateStatus(id, dto.status);
  }

  // Admin only - delete an application
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.delete(id);
  }
}
