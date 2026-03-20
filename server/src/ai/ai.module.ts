import { Module } from '@nestjs/common';
import { AiClientService } from './ai-client.service';
import { ResumeParserService } from './resume-parser.service';
import { ScreeningService } from './screening.service';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  controllers: [InterviewController],
  providers: [
    AiClientService,
    ResumeParserService,
    ScreeningService,
    InterviewService,
    EvaluationService,
  ],
  exports: [
    AiClientService,
    ResumeParserService,
    ScreeningService,
    InterviewService,
    EvaluationService,
  ],
})
export class AiModule {}
