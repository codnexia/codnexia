// Logs admin actions (login, content edits, uploads) for the dashboard activity feed
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class ActivityService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  // Log an admin action (called from other services)
  async log(action: string, description: string, color = '#2DD4A8') {
    await this.db.insert(schema.activityLogs).values({
      action,
      description,
      color,
    });
  }

  // Get recent activity entries for the dashboard feed
  async getRecent(limit = 10) {
    return this.db
      .select()
      .from(schema.activityLogs)
      .orderBy(desc(schema.activityLogs.createdAt))
      .limit(limit);
  }
}
