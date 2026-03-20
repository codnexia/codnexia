// AI-powered screening: scores applications against job requirements
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { AiClientService } from './ai-client.service';

export interface ScreeningResult {
  score: number;
  notes: string;
  breakdown: {
    skillsMatch: number;
    experienceMatch: number;
    coverLetterQuality: number;
  };
}

@Injectable()
export class ScreeningService {
  private readonly logger = new Logger(ScreeningService.name);

  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly aiClient: AiClientService,
  ) {}

  async screenApplication(applicationId: string): Promise<ScreeningResult | null> {
    const [application] = await this.db
      .select()
      .from(schema.careerApplications)
      .where(eq(schema.careerApplications.id, applicationId));

    if (!application) {
      this.logger.warn(`Application ${applicationId} not found for screening`);
      return null;
    }

    // Find matching job position for requirements context
    const [position] = await this.db
      .select()
      .from(schema.jobPositions)
      .where(eq(schema.jobPositions.title, application.position));

    const systemPrompt = `You are an expert AI recruiter. Score this job application on a scale of 0-100. Consider:
1. Skills match (how well the candidate's tech stack matches the role)
2. Experience relevance (years of experience, current role fit)
3. Cover letter quality (communication skills, motivation, specificity)

Return ONLY valid JSON:
{
  "score": <number 0-100>,
  "notes": "<2-3 sentence evaluation summary>",
  "breakdown": {
    "skillsMatch": <number 0-100>,
    "experienceMatch": <number 0-100>,
    "coverLetterQuality": <number 0-100>
  }
}

Return ONLY the JSON object, no markdown formatting.`;

    const applicationSummary = `
POSITION: ${application.position}
${position?.requirements ? `REQUIREMENTS: ${position.requirements}` : ''}
${position?.description ? `DESCRIPTION: ${position.description}` : ''}

CANDIDATE:
Name: ${application.firstName} ${application.lastName}
Current Role: ${application.currentRole}${application.company ? ` at ${application.company}` : ''}
Experience: ${application.experience}
Employment Type: ${application.employmentType}
Work Mode: ${application.workMode}
Tech Stack: ${(application.primaryStack as string[] || []).join(', ')}
Other Skills: ${application.otherSkills || 'N/A'}
Proficiency: ${application.proficiency || 'N/A'}
Degree: ${application.degree}${application.field ? ` in ${application.field}` : ''}
${application.university ? `University: ${application.university}` : ''}
${application.certifications ? `Certifications: ${application.certifications}` : ''}
${application.resumeParsed ? `Resume Summary: ${JSON.stringify(application.resumeParsed)}` : ''}

COVER LETTER:
${application.coverLetter}
`.trim();

    try {
      const response = await this.aiClient.complete(systemPrompt, applicationSummary);
      const result: ScreeningResult = JSON.parse(response);

      // Ensure score is within bounds
      result.score = Math.max(0, Math.min(100, Math.round(result.score)));

      // Update application with screening results
      await this.db
        .update(schema.careerApplications)
        .set({
          screeningScore: result.score,
          screeningNotes: result.notes,
          screeningStatus: 'screened',
        })
        .where(eq(schema.careerApplications.id, applicationId));

      this.logger.log(`Application ${applicationId.slice(0, 8)} screened: score=${result.score}`);
      return result;
    } catch (error) {
      this.logger.error(`Screening failed for ${applicationId}: ${(error as Error).message}`);

      await this.db
        .update(schema.careerApplications)
        .set({ screeningStatus: 'failed' })
        .where(eq(schema.careerApplications.id, applicationId));

      return null;
    }
  }
}
