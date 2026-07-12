import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Public User Profiles')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
