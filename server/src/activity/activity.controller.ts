// Activity feed endpoint - admin only
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // Get recent admin activity for the dashboard
  @Get()
  getRecent() {
    return this.activityService.getRecent();
  }
}
