// Media file endpoints - upload, list, delete (all admin-only)
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { readFileSync, unlinkSync } from 'fs';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validateFileMagic } from '../common/utils/file-validation';

// Allowed file extensions and MIME types for upload (SVG removed — XSS risk)
const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|webp|pdf|mp4|webm)$/i;
const ALLOWED_MIME: Set<string> = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'video/mp4', 'video/webm',
]);

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // List paginated uploaded files
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.mediaService.findAll(pagination.page, pagination.limit);
  }

  // Upload a single file (stored in /uploads with unique name)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        // Generate unique filename: timestamp-random.ext
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // H8: 10MB max
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_EXT.test(file.originalname)) {
          return cb(new BadRequestException('File type not allowed. Accepted: jpg, png, gif, webp, pdf, mp4, webm'), false);
        }
        if (!ALLOWED_MIME.has(file.mimetype)) {
          return cb(new BadRequestException(`MIME type "${file.mimetype}" not allowed`), false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    // Validate file magic bytes to prevent MIME spoofing
    const buffer = readFileSync(file.path);
    const { valid, detectedMime } = validateFileMagic(buffer, ALLOWED_MIME);
    if (!valid) {
      try { unlinkSync(file.path); } catch {}
      throw new BadRequestException(
        `File content does not match an allowed type (detected: ${detectedMime ?? 'unknown'})`,
      );
    }

    return this.mediaService.create(file);
  }

  // Delete a file by ID
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.remove(id);
  }
}
