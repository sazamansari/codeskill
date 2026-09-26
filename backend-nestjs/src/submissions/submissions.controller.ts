import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new submission' })
  async createSubmission(
    @CurrentUser('_id') userId: string,
    @Body() data: any,
  ) {
    const submission = await this.submissionsService.createSubmission(
      userId,
      data,
    );
    return { submission };
  }

  @Get('problem/:problemId')
  @ApiOperation({ summary: 'Get submissions for a specific problem' })
  async getSubmissionsByProblem(
    @CurrentUser('_id') userId: string,
    @Param('problemId') problemId: string,
  ) {
    const submissions = await this.submissionsService.getSubmissionsByProblem(
      userId,
      problemId,
    );
    return { count: submissions.length, data: submissions };
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent submissions' })
  async getRecentSubmissions(@CurrentUser('_id') userId: string) {
    const submissions =
      await this.submissionsService.getRecentSubmissions(userId);
    return { count: submissions.length, data: submissions };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats(@CurrentUser('_id') userId: string) {
    return this.submissionsService.getUserStats(userId);
  }
}
