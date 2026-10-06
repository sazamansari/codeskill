import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('assessment/:id/overview')
  async getOverview(@Param('id') id: string) {
    return this.analyticsService.getAssessmentOverview(id);
  }

  @Get('assessment/:id/leaderboard')
  async getLeaderboard(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.analyticsService.getAssessmentLeaderboard(
      id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('assessment/:id/questions')
  async getQuestionAnalytics(@Param('id') id: string) {
    return this.analyticsService.getQuestionAnalytics(id);
  }
}
