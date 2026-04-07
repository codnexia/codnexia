// Handles career application submissions - save to DB and retrieve for admin
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, eq, sql, isNotNull } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { ScreeningService } from '../ai/screening.service';
import { InterviewService } from '../ai/interview.service';
import { EvaluationService } from '../ai/evaluation.service';
import { MailService } from '../mail/mail.service';
import { CreateCareerApplicationDto } from './dto/create-career-application.dto';

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private readonly activityService: ActivityService,
    private readonly screeningService: ScreeningService,
    private readonly interviewService: InterviewService,
    private readonly evaluationService: EvaluationService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateCareerApplicationDto) {
    const [application] = await this.db
      .insert(schema.careerApplications)
      .values({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        countryCode: dto.countryCode,
        country: dto.country,
        city: dto.city,
        nationality: dto.nationality,
        linkedin: dto.linkedin,
        github: dto.github,
        portfolio: dto.portfolio,
        website: dto.website,
        currentRole: dto.currentRole,
        company: dto.company,
        experience: dto.experience,
        noticePeriod: dto.noticePeriod,
        employmentType: dto.employmentType,
        workMode: dto.workMode,
        salaryExpectation: dto.salaryExpectation,
        salaryCurrency: dto.salaryCurrency,
        primaryStack: dto.primaryStack,
        otherSkills: dto.otherSkills,
        proficiency: dto.proficiency,
        languages: dto.languages,
        certifications: dto.certifications,
        degree: dto.degree,
        field: dto.field,
        university: dto.university,
        gradYear: dto.gradYear,
        position: dto.position,
        coverLetter: dto.coverLetter,
        heardFrom: dto.heardFrom,
        availability: dto.availability,
        callDate: dto.callDate,
        callTime: dto.callTime,
        timezone: dto.timezone,
        callTopics: dto.callTopics ?? [],
        resumeUrl: dto.resumeUrl,
        resumeParsed: dto.resumeParsed,
      })
      .returning();

    // Log activity (non-blocking)
    try {
      await this.activityService.log(
        'career',
        `New application from ${dto.firstName} ${dto.lastName} for ${dto.position}`,
        '#4A9FF5',
      );
    } catch (e) {
      this.logger.warn(`Activity log failed: ${(e as Error).message}`);
    }

    // Fire-and-forget: AI screening
    this.screeningService.screenApplication(application.id).catch(e =>
      this.logger.warn(`Auto-screening failed: ${(e as Error).message}`),
    );

    // Fire-and-forget: email notifications
    this.mailService.sendApplicationReceived(
      dto.email, dto.firstName, dto.position,
    ).catch(e => this.logger.warn(`Candidate email failed: ${(e as Error).message}`));

    this.mailService.sendAdminNewApplication(
      `${dto.firstName} ${dto.lastName}`, dto.position,
    ).catch(e => this.logger.warn(`Admin notification email failed: ${(e as Error).message}`));

    return application;
  }

  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.careerApplications)
        .orderBy(desc(schema.careerApplications.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.careerApplications),
    ]);
    return { data, total: Number(total), page, limit };
  }

  async findOne(id: string) {
    const [application] = await this.db
      .select()
      .from(schema.careerApplications)
      .where(eq(schema.careerApplications.id, id));
    return application ?? null;
  }

  async updateStatus(id: string, status: string) {
    const [updated] = await this.db
      .update(schema.careerApplications)
      .set({ status })
      .where(eq(schema.careerApplications.id, id))
      .returning();

    try {
      await this.activityService.log(
        'career',
        `Application ${id.slice(0, 8)} status changed to ${status}`,
        status === 'hired' ? '#2DD4A8' : status === 'rejected' ? '#E84855' : '#F5A623',
      );
    } catch (e) {
      this.logger.warn(`Activity log failed: ${(e as Error).message}`);
    }

    // Send status update email to candidate
    if (updated) {
      this.mailService.sendStatusUpdate(
        updated.email, updated.firstName, status, updated.position,
      ).catch(e => this.logger.warn(`Status email failed: ${(e as Error).message}`));
    }

    return updated;
  }

  async rescreen(id: string) {
    const result = await this.screeningService.screenApplication(id);
    if (!result) throw new Error('Screening failed');
    return result;
  }

  async inviteInterview(id: string) {
    const application = await this.findOne(id);
    if (!application) throw new Error('Application not found');

    const interview = await this.interviewService.createInterview(id);
    const clientUrl = this.config.get<string>('CLIENT_URL', 'http://localhost:5173');
    const interviewUrl = `${clientUrl}/interview?token=${interview.accessToken}`;

    // Send interview invitation email
    await this.mailService.sendInterviewInvitation(
      application.email,
      application.firstName,
      application.position,
      interviewUrl,
      interview.expiresAt,
    );

    // Update status
    await this.db
      .update(schema.careerApplications)
      .set({ status: 'interviewed' })
      .where(eq(schema.careerApplications.id, id));

    return { interview, interviewUrl };
  }

  async getRankings(positionFilter?: string) {
    const results = await this.evaluationService.getRankings(positionFilter);
    return results;
  }

  async delete(id: string) {
    await this.db
      .delete(schema.careerApplications)
      .where(eq(schema.careerApplications.id, id));
    return { success: true };
  }

  async count() {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.careerApplications);
    return Number(count);
  }
}
