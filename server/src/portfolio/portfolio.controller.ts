// Portfolio endpoints - public GET for published, protected CRUD for admin
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|webp)$/i;
const ALLOWED_MIME: Set<string> = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
]);

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Public - get published portfolio projects
  @Get('public')
  findPublished() {
    return this.portfolioService.findPublished();
  }

  // Admin only - list paginated portfolios
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.portfolioService.findAll(pagination.page, pagination.limit);
  }

  // Admin only - create a new portfolio project
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(dto);
  }

  // Admin only - update a portfolio project
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePortfolioDto) {
    return this.portfolioService.update(id, dto);
  }

  // Admin only - delete a portfolio project
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioService.remove(id);
  }

  // Admin only - upload and optimize portfolio image
  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `portfolio-orig-${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_EXT.test(file.originalname)) {
          return cb(new BadRequestException('File type not allowed. Accepted: jpg, png, gif, webp'), false);
        }
        if (!ALLOWED_MIME.has(file.mimetype)) {
          return cb(new BadRequestException(`MIME type "${file.mimetype}" not allowed`), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    return this.portfolioService.uploadImage(id, file);
  }

  // Admin only - remove portfolio image
  @UseGuards(JwtAuthGuard)
  @Delete(':id/image')
  removeImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioService.removeImage(id);
  }
}
