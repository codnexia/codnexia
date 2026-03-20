// Composite scoring and final recommendation for candidates
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, desc, isNotNull } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);

  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
  ) {}

  async computeCompositeScore(applicationId: string) {
    const [application] = await this.db
      .select()
      .from(schema.careerApplications)
      .where(eq(schema.careerApplications.id, applicationId));

    if (!application) return null;

    const screeningScore = application.screeningScore ?? 0;
    const interviewScore = application.interviewScore ?? 0;

    // Get interview breakdown for problem-solving sub-score
    let problemSolvingScore = interviewScore; // fallback to overall interview score
    const [interview] = await this.db
      .select()
      .from(schema.aiInterviews)
      .where(eq(schema.aiInterviews.applicationId, applicationId));

    if (interview?.evaluationNotes) {
      try {
        // The evaluation notes may contain breakdown info; use interview score as proxy
        problemSolvingScore = interview.evaluationScore ?? interviewScore;
      } catch {
        // Use default
      }
    }

    // Weighted formula: CV/Screening 30%, Interview 40%, Problem-solving 30%
    const composite = Math.round(
      screeningScore * 0.3 +
      interviewScore * 0.4 +
      problemSolvingScore * 0.3,
    );

    let recommendation: string;
    if (composite >= 80) recommendation = 'strong_hire';
    else if (composite >= 65) recommendation = 'hire';
    else if (composite >= 45) recommendation = 'maybe';
    else recommendation = 'no_hire';

    await this.db
      .update(schema.careerApplications)
      .set({
        compositeScore: composite,
        finalRecommendation: recommendation,
      })
      .where(eq(schema.careerApplications.id, applicationId));

    this.logger.log(`Composite score for ${applicationId.slice(0, 8)}: ${composite} → ${recommendation}`);
    return { composite, recommendation };
  }

  async getRankings(positionFilter?: string) {
    let query = this.db
      .select()
      .from(schema.careerApplications)
      .where(isNotNull(schema.careerApplications.compositeScore))
      .orderBy(desc(schema.careerApplications.compositeScore));

    const results = await query;

    if (positionFilter) {
      return results.filter(r => r.position === positionFilter);
    }
    return results;
  }
}
