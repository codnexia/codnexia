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
  UseGuards,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // List all content pages
  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  // Create a new content page
  @Post()
  create(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  // Update content page by ID
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  // Delete content page by ID
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.remove(id);
  }
}
