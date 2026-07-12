import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContestsService } from './contests.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Contests')
@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public contests' })
  async getContests() {
    return this.contestsService.getContests();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get contest details' })
  async getContest(@Param('slug') slug: string) {
    return this.contestsService.getContest(slug);
  }

  @Post(':id/register')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Register for a contest' })
  async register(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body('password') password?: string,
  ) {
    return this.contestsService.register(id, userId, password);
  }
}
