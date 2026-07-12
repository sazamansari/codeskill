import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all users with pagination and search' })
  async getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    return this.adminService.getUsers(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10,
      search,
    );
  }

  @Put(':id/role')
  @ApiOperation({ summary: 'Update user role (admin/campus/company)' })
  async updateUserRole(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateUserRole(id, body);
  }

  @Get(':id/report')
  @ApiOperation({ summary: 'Get candidate report' })
  async getReport(@Param('id') id: string) {
    return this.adminService.getReport(id);
  }
}
