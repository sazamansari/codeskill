import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../database/schemas/company.schema';
import { Job, JobDocument } from '../database/schemas/job.schema';
import {
  CompanyUser,
  CompanyUserDocument,
} from '../database/schemas/company-user.schema';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(CompanyUser.name)
    private companyUserModel: Model<CompanyUserDocument>,
  ) {}

  async getCompanies() {
    return this.companyModel
      .find({ isVerified: true })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getCompanyProfile(username: string) {
    const company = await this.companyModel
      .findOne({ username, isVerified: true })
      .lean();
    if (!company) throw new NotFoundException('Company not found');

    const jobs = await this.jobModel
      .find({ company: company._id, status: 'Published' })
      .lean();

    return { ...company, jobs };
  }

  async registerCompany(userId: string, data: any) {
    const { name, username, industry, website } = data;
    const existingCompany = await this.companyModel.findOne({
      username: username.toLowerCase(),
    });
    if (existingCompany) {
      throw new BadRequestException('Company username already exists');
    }

    const company = await this.companyModel.create({
      name,
      username,
      industry,
      website,
      createdBy: userId,
    });

    await this.companyUserModel.create({
      company: company._id,
      user: userId,
      role: 'Owner',
    });

    return { success: true, company };
  }

  async getMyCompanies(userId: string) {
    const memberships = await this.companyUserModel
      .find({ user: userId, isActive: true })
      .populate('company')
      .sort({ createdAt: -1 });

    return { success: true, companies: memberships };
  }

  async getCompanyById(companyId: string) {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return { success: true, company };
  }

  async updateCompany(companyId: string, updates: any) {
    delete updates.username;
    delete updates.createdBy;

    const company = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $set: updates },
      { new: true, runValidators: true },
    );
    return { success: true, company };
  }
}
