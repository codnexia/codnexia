// AI interview: generates questions, handles answers, evaluates performance
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { AiClientService } from './ai-client.service';
import { EvaluationService } from './evaluation.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private readonly aiClient: AiClientService,
    private readonly evaluationService: EvaluationService,
    private readonly mailService: MailService,
  ) {}

  async createInterview(applicationId: string) {
    const [application] = await this.db
      .select()
      .from(schema.careerApplications)
      .where(eq(schema.careerApplications.id, applicationId));

    if (!application) throw new Error('Application not found');

    // Check for existing active interview
    const [existing] = await this.db
      .select()
      .from(schema.aiInterviews)
      .where(eq(schema.aiInterviews.applicationId, applicationId));

    if (existing && existing.status !== 'expired') {
      return existing;
    }

    // Find position requirements
    const [position] = await this.db
      .select()
      .from(schema.jobPositions)
      .where(eq(schema.jobPositions.title, application.position));

    // Generate questions via Claude
    const systemPrompt = `You are an expert AI interviewer for a software company. Generate 8 interview questions for this candidate. Questions should cover:
- 2 technical skills questions (based on their tech stack)
- 2 problem-solving questions (system design or algorithmic thinking)
- 2 experience/project questions (based on their background)
- 1 culture fit question
- 1 career goals question

Each question should be specific to the candidate's background, not generic.

Return ONLY valid JSON array:
[
  { "category": "Technical", "question": "..." },
  { "category": "Technical", "question": "..." },
  { "category": "Problem Solving", "question": "..." },
  { "category": "Problem Solving", "question": "..." },
  { "category": "Experience", "question": "..." },
  { "category": "Experience", "question": "..." },
  { "category": "Culture Fit", "question": "..." },
  { "category": "Career Goals", "question": "..." }
]

Return ONLY the JSON array, no markdown formatting.`;

    const context = `
POSITION: ${application.position}
${position?.requirements ? `REQUIREMENTS: ${position.requirements}` : ''}

CANDIDATE:
Role: ${application.currentRole}${application.company ? ` at ${application.company}` : ''}
Experience: ${application.experience}
Tech Stack: ${(application.primaryStack as string[] || []).join(', ')}
Degree: ${application.degree}${application.field ? ` in ${application.field}` : ''}
Screening Score: ${application.screeningScore ?? 'N/A'}
Screening Notes: ${application.screeningNotes ?? 'N/A'}
${application.resumeParsed ? `Resume: ${JSON.stringify(application.resumeParsed)}` : ''}
`.trim();

    let questions: { category: string; question: string }[];
    try {
      const response = await this.aiClient.complete(systemPrompt, context);
      questions = JSON.parse(response);
    } catch {
      // Fallback questions if AI fails
      questions = [
        { category: 'Technical', question: `Describe your experience with ${(application.primaryStack as string[])?.[0] || 'your primary technology'} and a challenging problem you solved with it.` },
        { category: 'Technical', question: 'How do you approach debugging a production issue? Walk me through your process.' },
        { category: 'Problem Solving', question: 'How would you design a scalable notification system for a web application?' },
        { category: 'Problem Solving', question: 'Describe a time when you had to optimize a slow-performing feature. What was your approach?' },
        { category: 'Experience', question: `Tell me about your most impactful project at ${application.company || 'your current company'}.` },
        { category: 'Experience', question: 'Describe a time you had to learn a new technology quickly. How did you approach it?' },
        { category: 'Culture Fit', question: 'How do you handle disagreements with team members about technical decisions?' },
        { category: 'Career Goals', question: 'Where do you see yourself in 3 years, and how does this role align with that vision?' },
      ];
    }

    const accessToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [interview] = await this.db
      .insert(schema.aiInterviews)
      .values({
        applicationId,
        accessToken,
        status: 'pending',
        questions,
        answers: [],
        currentQuestionIndex: 0,
        expiresAt,
      })
      .returning();

    this.logger.log(`Interview created for application ${applicationId.slice(0, 8)} with ${questions.length} questions`);
    return interview;
  }

  async getByToken(token: string) {
    const [interview] = await this.db
      .select()
      .from(schema.aiInterviews)
      .where(eq(schema.aiInterviews.accessToken, token));

    if (!interview) return null;

    // Check expiry
    if (new Date() > interview.expiresAt) {
      if (interview.status !== 'expired') {
        await this.db
          .update(schema.aiInterviews)
          .set({ status: 'expired' })
          .where(eq(schema.aiInterviews.id, interview.id));
      }
      return { ...interview, status: 'expired' };
    }

    return interview;
  }

  async getByApplicationId(applicationId: string) {
    const [interview] = await this.db
      .select()
      .from(schema.aiInterviews)
      .where(eq(schema.aiInterviews.applicationId, applicationId));
    return interview ?? null;
  }

  async submitAnswer(token: string, questionIndex: number, answer: string) {
    const interview = await this.getByToken(token);
    if (!interview) throw new Error('Interview not found');
    if (interview.status === 'expired') throw new Error('Interview has expired');
    if (interview.status === 'completed') throw new Error('Interview already completed');

    const questions = interview.questions as { category: string; question: string }[];
    if (questionIndex < 0 || questionIndex >= questions.length) {
      throw new Error('Invalid question index');
    }

    const answers = [...(interview.answers as { questionIndex: number; answer: string; submittedAt: string }[])];
    answers.push({ questionIndex, answer, submittedAt: new Date().toISOString() });

    const isLastQuestion = questionIndex >= questions.length - 1;
    const nextIndex = isLastQuestion ? questionIndex : questionIndex + 1;

    const updateData: Record<string, unknown> = {
      answers,
      currentQuestionIndex: nextIndex,
    };

    if (interview.status === 'pending') {
      updateData.status = 'in_progress';
      updateData.startedAt = new Date();
    }

    if (isLastQuestion) {
      updateData.status = 'completed';
      updateData.completedAt = new Date();
    }

    await this.db
      .update(schema.aiInterviews)
      .set(updateData)
      .where(eq(schema.aiInterviews.id, interview.id));

    // If completed, trigger evaluation asynchronously
    if (isLastQuestion) {
      this.evaluateInterview(interview.id).catch(err =>
        this.logger.error(`Auto-evaluation failed: ${err.message}`),
      );
    }

    return {
      completed: isLastQuestion,
      nextQuestionIndex: isLastQuestion ? null : nextIndex,
      nextQuestion: isLastQuestion ? null : questions[nextIndex],
      totalQuestions: questions.length,
      answeredCount: answers.length,
    };
  }

  async evaluateInterview(interviewId: string) {
    const [interview] = await this.db
      .select()
      .from(schema.aiInterviews)
      .where(eq(schema.aiInterviews.id, interviewId));

    if (!interview) throw new Error('Interview not found');

    const questions = interview.questions as { category: string; question: string }[];
    const answers = interview.answers as { questionIndex: number; answer: string; submittedAt: string }[];

    const qaPairs = questions.map((q, i) => {
      const a = answers.find(ans => ans.questionIndex === i);
      return `[${q.category}] Q: ${q.question}\nA: ${a?.answer || '(not answered)'}`;
    }).join('\n\n');

    const systemPrompt = `You are an expert interview evaluator. Evaluate this candidate's interview performance. Score on a scale of 0-100 considering:
- Technical knowledge and depth
- Problem-solving ability
- Communication clarity
- Experience relevance
- Cultural fit and enthusiasm

Return ONLY valid JSON:
{
  "score": <number 0-100>,
  "notes": "<3-4 sentence detailed evaluation>",
  "recommendation": "<one of: strong_hire, hire, maybe, no_hire>",
  "breakdown": {
    "technical": <number 0-100>,
    "problemSolving": <number 0-100>,
    "communication": <number 0-100>,
    "experience": <number 0-100>,
    "cultureFit": <number 0-100>
  }
}

Return ONLY the JSON object, no markdown formatting.`;

    try {
      const response = await this.aiClient.complete(systemPrompt, qaPairs);
      const evaluation = JSON.parse(response);
      const score = Math.max(0, Math.min(100, Math.round(evaluation.score)));

      await this.db
        .update(schema.aiInterviews)
        .set({
          evaluationScore: score,
          evaluationNotes: evaluation.notes,
          evaluationRecommendation: evaluation.recommendation,
        })
        .where(eq(schema.aiInterviews.id, interviewId));

      // Update application interview score
      await this.db
        .update(schema.careerApplications)
        .set({ interviewScore: score })
        .where(eq(schema.careerApplications.id, interview.applicationId));

      this.logger.log(`Interview ${interviewId.slice(0, 8)} evaluated: score=${score}, rec=${evaluation.recommendation}`);

      // Compute composite score
      this.evaluationService.computeCompositeScore(interview.applicationId).catch(err =>
        this.logger.error(`Composite scoring failed: ${err.message}`),
      );

      // Send completion email to candidate
      const [application] = await this.db
        .select()
        .from(schema.careerApplications)
        .where(eq(schema.careerApplications.id, interview.applicationId));

      if (application) {
        this.mailService.sendInterviewCompleted(application.email, application.firstName).catch(err =>
          this.logger.warn(`Completion email failed: ${err.message}`),
        );

        // High score alert to admin
        if (score >= 80) {
          this.mailService.sendHighScoreAlert(
            `${application.firstName} ${application.lastName}`,
            application.position,
            score,
          ).catch(err => this.logger.warn(`High score alert failed: ${err.message}`));
        }
      }

      return evaluation;
    } catch (error) {
      this.logger.error(`Interview evaluation failed: ${(error as Error).message}`);
      throw error;
    }
  }
}
