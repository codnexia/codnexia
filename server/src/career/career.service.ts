// Handles career application submissions - save to DB and retrieve for admin
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { desc, eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { CreateCareerApplicationDto } from './dto/create-career-application.dto';

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);

  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
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

    return updated;
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
