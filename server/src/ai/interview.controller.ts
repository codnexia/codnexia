// Interview endpoints: public (token-auth) + admin (JWT)
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InterviewService } from './interview.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  // Public — candidate accesses interview via token
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @Get(':token')
  async getInterview(@Param('token') token: string) {
    if (!/^[a-f0-9]{64}$/.test(token)) {
      throw new BadRequestException('Invalid interview token');
    }
    const interview = await this.interviewService.getByToken(token);
    if (!interview) throw new NotFoundException('Interview not found');

    // Return safe public view (no internal IDs exposed beyond what's needed)
    const questions = interview.questions as { category: string; question: string }[];
    const answers = interview.answers as { questionIndex: number; answer: string; submittedAt: string }[];
    return {
      status: interview.status,
      questions: questions.map((q, i) => ({
        index: i,
        category: q.category,
        question: q.question,
        answered: answers.some(a => a.questionIndex === i),
      })),
      currentQuestionIndex: interview.currentQuestionIndex,
      totalQuestions: questions.length,
      answeredCount: answers.length,
      expiresAt: interview.expiresAt,
      completedAt: interview.completedAt,
    };
  }

  // Public — candidate submits an answer
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Post(':token/answer')
  async submitAnswer(
    @Param('token') token: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    if (!/^[a-f0-9]{64}$/.test(token)) {
      throw new BadRequestException('Invalid interview token');
    }
    return this.interviewService.submitAnswer(token, dto.questionIndex, dto.answer);
  }

  // Admin — create interview for an application
  @UseGuards(JwtAuthGuard)
  @Post('create/:applicationId')
  async createInterview(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    return this.interviewService.createInterview(applicationId);
  }

  // Admin — get full interview details
  @UseGuards(JwtAuthGuard)
  @Get('admin/:applicationId')
  async getInterviewAdmin(@Param('applicationId', ParseUUIDPipe) applicationId: string) {
    const interview = await this.interviewService.getByApplicationId(applicationId);
    if (!interview) throw new NotFoundException('No interview found for this application');
    return interview;
  }
}
