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

@ApiTags('Admin - Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/companies')
export class AdminCompaniesController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all companies' })
  async getCompanies(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    return this.adminService.getCompanies(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
      search,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Approve or create a company' })
  async createCompany(@Body() body: any) {
    return { success: true, message: 'Company action completed' };
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Toggle company verification' })
  async toggleVerify(@Param('id') id: string) {
    return this.adminService.toggleCompanyVerification(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company' })
  async deleteCompany(@Param('id') id: string) {
    return this.adminService.deleteCompany(id);
  }
}
