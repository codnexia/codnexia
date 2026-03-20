import { Inject, Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';

@Injectable()
export class JobPositionService {
  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
  ) {}

  // Public - get only open positions
  async findOpen() {
    return this.db
      .select()
      .from(schema.jobPositions)
      .where(eq(schema.jobPositions.open, true))
      .orderBy(asc(schema.jobPositions.sortOrder), desc(schema.jobPositions.createdAt));
  }

  // Admin - get all positions
  async findAll(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.jobPositions)
        .orderBy(asc(schema.jobPositions.sortOrder), desc(schema.jobPositions.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.jobPositions),
    ]);
    return { data, total: Number(total), page, limit };
  }

  async create(dto: CreateJobPositionDto) {
    const [position] = await this.db
      .insert(schema.jobPositions)
      .values({
        title: dto.title,
        type: dto.type,
        mode: dto.mode,
        department: dto.department,
        description: dto.description,
        requirements: dto.requirements,
        open: dto.open ?? true,
        sortOrder: dto.sortOrder ?? 0,
      })
      .returning();
    return position;
  }

  async update(id: string, dto: UpdateJobPositionDto) {
    const [updated] = await this.db
      .update(schema.jobPositions)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.jobPositions.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await this.db
      .delete(schema.jobPositions)
      .where(eq(schema.jobPositions.id, id));
    return { success: true };
  }
}
