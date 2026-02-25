// Analytics endpoints - public tracking + admin dashboard data
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrackViewDto } from './dto/track-view.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Public - client site calls this on every page navigation
  @Post('track')
  track(@Body() dto: TrackViewDto) {
    return this.analyticsService.trackView(dto);
  }

  // Admin - dashboard stats (total visitors, page views, weekly chart)
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  dashboard() {
    return this.analyticsService.getDashboardStats();
  }

  // Admin - visitors panel data (live visitors, sessions table)
  @UseGuards(JwtAuthGuard)
  @Get('visitors')
  visitors() {
    return this.analyticsService.getVisitorData();
  }
}
