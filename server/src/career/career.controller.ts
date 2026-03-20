// Career endpoints - public POST for applications, protected GET/PATCH/DELETE for admin
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { CareerService } from './career.service';
import { CreateCareerApplicationDto } from './dto/create-career-application.dto';
import { UpdateCareerStatusDto } from './dto/update-career-status.dto';
import { RankingsQueryDto } from './dto/rankings-query.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResumeParserService } from '../ai/resume-parser.service';
import { validateFileMagic } from '../common/utils/file-validation';
import * as fs from 'fs';

const RESUME_MIMES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@Controller('careers')
export class CareerController {
  constructor(
    private readonly careerService: CareerService,
    private readonly resumeParser: ResumeParserService,
  ) {}

  // Public - upload and parse resume
  @Throttle({ strict: { ttl: 3600000, limit: 10 } })
  @Post('resume')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/resumes',
      filename: (_req, file, cb) => {
        const name = randomBytes(16).toString('hex') + extname(file.originalname);
        cb(null, name);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
      if (RESUME_MIMES.has(file.mimetype)) cb(null, true);
      else cb(new BadRequestException('Only PDF and DOCX files are accepted'), false);
    },
  }))
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    // Validate magic bytes
    const buffer = fs.readFileSync(file.path);
    const { valid, detectedMime } = validateFileMagic(buffer, RESUME_MIMES);
    if (!valid) {
      fs.unlinkSync(file.path);
      throw new BadRequestException(`Invalid file content. Detected: ${detectedMime || 'unknown'}`);
    }

    const resumeUrl = `/uploads/resumes/${file.filename}`;
    const resumeParsed = await this.resumeParser.parse(buffer, file.mimetype);

    return { resumeUrl, resumeParsed };
  }

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

  // Admin only — ranked candidates with composite scores
  @UseGuards(JwtAuthGuard)
  @Get('rankings')
  getRankings(@Query() query: RankingsQueryDto) {
    return this.careerService.getRankings(query.position);
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

  // Admin only — manually trigger AI screening
  @UseGuards(JwtAuthGuard)
  @Post(':id/screen')
  screen(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.rescreen(id);
  }

  // Admin only — send AI interview invitation
  @UseGuards(JwtAuthGuard)
  @Post(':id/invite-interview')
  inviteInterview(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.inviteInterview(id);
  }

  // Admin only - delete an application
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.delete(id);
  }
}
