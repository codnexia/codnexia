// Analytics service - tracks page views and computes dashboard/visitor stats
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, sql, gte } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { TrackViewDto } from './dto/track-view.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {}

  // Record a page view (called from the public client site)
  async trackView(dto: TrackViewDto) {
    await this.db.insert(schema.pageViews).values({
      page: dto.page,
      sessionId: dto.sessionId,
      device: dto.device ?? 'Desktop',
    });
    return { success: true };
  }

  // Dashboard stats: total visitors, page views, active now, avg session
  async getDashboardStats() {
    // Total unique sessions (visitors)
    const totalVisitors = await this.db
      .select({ count: sql<number>`count(distinct ${schema.pageViews.sessionId})` })
      .from(schema.pageViews);

    // Total page views
    const totalViews = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.pageViews);

    // Active now = unique sessions in last 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeNow = await this.db
      .select({ count: sql<number>`count(distinct ${schema.pageViews.sessionId})` })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, fiveMinAgo));

    // Today's views
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayViews = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, startOfDay));

    // Weekly traffic - views per day for the last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRaw = await this.db
      .select({
        day: sql<string>`to_char(${schema.pageViews.createdAt}, 'Dy')`,
        dayNum: sql<number>`extract(dow from ${schema.pageViews.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, weekAgo))
      .groupBy(
        sql`to_char(${schema.pageViews.createdAt}, 'Dy')`,
        sql`extract(dow from ${schema.pageViews.createdAt})`,
      )
      .orderBy(sql`extract(dow from ${schema.pageViews.createdAt})`);

    // Build weekly traffic with all 7 days (fill zeros for missing days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyMap = new Map(weeklyRaw.map((r) => [Number(r.dayNum), Number(r.count)]));
    const weeklyData = dayNames.map((_, i) => weeklyMap.get(i) ?? 0);
    // Reorder to start from Monday
    const mondayFirst = [...weeklyData.slice(1), weeklyData[0]];

    return {
      stats: [
        {
          label: 'Total Visitors',
          value: Number(totalVisitors[0]?.count ?? 0),
          change: 0,
          icon: '◐',
          spark: mondayFirst,
        },
        {
          label: 'Page Views',
          value: Number(totalViews[0]?.count ?? 0),
          change: 0,
          icon: '◑',
          spark: mondayFirst,
        },
        {
          label: 'Active Now',
          value: Number(activeNow[0]?.count ?? 0),
          change: 0,
          icon: '◉',
          spark: [],
        },
        {
          label: "Today's Views",
          value: Number(todayViews[0]?.count ?? 0),
          change: 0,
          icon: '◈',
          spark: [],
        },
      ],
      weeklyTraffic: {
        data: mondayFirst,
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    };
  }

  // Visitor stats + recent sessions for the visitors panel
  async getVisitorData() {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Live visitors (last 5 min)
    const liveCount = await this.db
      .select({ count: sql<number>`count(distinct ${schema.pageViews.sessionId})` })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, fiveMinAgo));

    // Today's views
    const todayViews = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, startOfDay));

    // Total views for bounce rate estimate
    const totalViews = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.pageViews);

    // Total unique sessions
    const totalSessions = await this.db
      .select({ count: sql<number>`count(distinct ${schema.pageViews.sessionId})` })
      .from(schema.pageViews);

    // Bounce rate: count sessions with exactly 1 page view / total sessions
    const singleViewSessions = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(
        this.db
          .select({ sid: schema.pageViews.sessionId, views: sql<number>`count(*)` })
          .from(schema.pageViews)
          .groupBy(schema.pageViews.sessionId)
          .having(sql`count(*) = 1`)
          .as('single_view'),
      );
    const sessionCount = Number(totalSessions[0]?.count ?? 0);
    const bounceCount = Number(singleViewSessions[0]?.count ?? 0);
    const bounceRate = sessionCount > 0
      ? Math.round((bounceCount / sessionCount) * 100)
      : 0;

    // Recent sessions (last 30 min) for the visitors table
    const recentViews = await this.db
      .select()
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, thirtyMinAgo))
      .orderBy(desc(schema.pageViews.createdAt))
      .limit(20);

    // Group by session to build visitor rows
    const sessionMap = new Map<string, typeof recentViews>();
    for (const view of recentViews) {
      const existing = sessionMap.get(view.sessionId) ?? [];
      existing.push(view);
      sessionMap.set(view.sessionId, existing);
    }

    const visitors = Array.from(sessionMap.entries()).map(([sid, views]) => {
      const latest = views[0];
      const earliest = views[views.length - 1];
      const durationMs = latest.createdAt.getTime() - earliest.createdAt.getTime();
      const durationMin = Math.floor(durationMs / 60000);
      const durationSec = Math.floor((durationMs % 60000) / 1000);
      const isActive = latest.createdAt.getTime() > fiveMinAgo.getTime();

      return {
        id: sid.slice(0, 8),
        page: latest.page,
        duration: durationMs > 0 ? `${durationMin}m ${durationSec}s` : '0m 0s',
        device: latest.device ?? 'Desktop',
        status: isActive ? 'active' : 'idle',
      };
    });

    return {
      stats: [
        { label: 'Live Visitors', value: Number(liveCount[0]?.count ?? 0), change: 0, icon: '◉', spark: [] },
        { label: "Today's Views", value: Number(todayViews[0]?.count ?? 0), change: 0, icon: '◑', spark: [] },
        { label: 'Bounce Rate', value: bounceRate, change: 0, icon: '◈', suffix: '%', spark: [] },
      ],
      visitors,
    };
  }
}
