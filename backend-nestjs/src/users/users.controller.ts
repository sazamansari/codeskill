import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Public User Profiles')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top users ranked by XP' })
  async getLeaderboard(@Query('limit') limit: string) {
    return this.usersService.getLeaderboard(parseInt(limit, 10) || 50);
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get public user profile' })
  async getPublicProfile(@Param('identifier') identifier: string) {
    const profile = await this.usersService.getPublicProfile(identifier);
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    return { success: true, profile };
  }
}
