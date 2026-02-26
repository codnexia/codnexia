// Media file endpoints - upload, list, delete (all admin-only)
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Allowed file extensions for upload
const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|webp|svg|pdf|mp4|webm)$/i;

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // List all uploaded files
  @Get()
  findAll() {
    return this.mediaService.findAll();
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
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_EXT.test(file.originalname)) {
          return cb(new BadRequestException('File type not allowed. Accepted: jpg, png, gif, webp, svg, pdf, mp4, webm'), false);
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    return this.mediaService.create(file);
  }

  // Delete a file by ID
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.remove(id);
  }
}
