// Testimonial endpoints - public GET for published, protected CRUD for admin
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  // Public - get published testimonials for the popup
  @Get('public')
  findPublished() {
    return this.testimonialService.findPublished();
  }

  // Admin only - list all testimonials
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.testimonialService.findAll();
  }

  // Admin only - create a new testimonial
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialService.create(dto);
  }

  // Admin only - update a testimonial
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialService.update(id, dto);
  }

  // Admin only - delete a testimonial
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(id);
  }
}
