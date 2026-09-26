import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all verified companies' })
  async getCompanies() {
    return this.companiesService.getCompanies();
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get company profile and jobs' })
  async getCompanyProfile(@Param('username') username: string) {
    return this.companiesService.getCompanyProfile(username);
  }
}
