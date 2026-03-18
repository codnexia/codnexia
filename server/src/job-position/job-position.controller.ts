import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JobPositionService } from './job-position.service';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('job-positions')
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  // Public - get open positions for the careers page
  @Get('public')
  findOpen() {
    return this.jobPositionService.findOpen();
  }

  // Admin - get all positions
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.jobPositionService.findAll(pagination.page, pagination.limit);
  }

  // Admin - create a new position
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateJobPositionDto) {
    return this.jobPositionService.create(dto);
  }

  // Admin - update a position
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobPositionDto,
  ) {
    return this.jobPositionService.update(id, dto);
  }

  // Admin - delete a position
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobPositionService.delete(id);
  }
}
