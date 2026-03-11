// Content page CRUD - all endpoints require JWT auth (admin only)
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // Get published content pages (public, no auth)
  @Get('public')
  findPublished() {
    return this.contentService.findPublished();
  }

  // List paginated content pages (admin only)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.contentService.findAll(pagination.page, pagination.limit);
  }

  // Create a new content page
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  // Update content page by ID
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  // Delete content page by ID
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.remove(id);
  }
}
