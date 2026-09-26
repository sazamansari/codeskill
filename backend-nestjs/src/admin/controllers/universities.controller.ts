import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminService } from '../admin.service';

@ApiTags('Admin - Universities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/universities')
export class AdminUniversitiesController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all universities' })
  async getUniversities(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    return this.adminService.getUniversities(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
      search,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Approve or create a university' })
  async createUniversity(@Body() body: any) {
    return { success: true, message: 'University action completed' };
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Toggle university verification' })
  async toggleVerify(@Param('id') id: string) {
    return this.adminService.toggleUniversityVerification(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a university' })
  async deleteUniversity(@Param('id') id: string) {
    return this.adminService.deleteUniversity(id);
  }
}
