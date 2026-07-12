import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  University,
  UniversityDocument,
} from '../database/schemas/university.schema';
import {
  UniversityUser,
  UniversityUserDocument,
} from '../database/schemas/university-user.schema';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CampusService {
  constructor(
    @InjectModel(University.name)
    private universityModel: Model<UniversityDocument>,
    @InjectModel(UniversityUser.name)
    private universityUserModel: Model<UniversityUserDocument>,
  ) {}

  async getUniversities() {
    return this.universityModel
      .find({ isVerified: true })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getUniversityProfile(username: string) {
    const university = await this.universityModel
      .findOne({ username, isVerified: true })
      .lean();
    if (!university) throw new NotFoundException('University not found');
    return university;
  }

  async registerUniversity(userId: string, data: any) {
    const { name, username, domain, website } = data;
    const existingUniversity = await this.universityModel.findOne({
      username: username.toLowerCase(),
    });
    if (existingUniversity) {
      throw new BadRequestException('University username already exists');
    }

    const university = await this.universityModel.create({
      name,
      username,
      domain,
      website,
      createdBy: userId,
    });

    await this.universityUserModel.create({
      university: university._id,
      user: userId,
      role: 'Admin',
    });

    return { success: true, university };
  }

  async getMyUniversities(userId: string) {
    const memberships = await this.universityUserModel
      .find({ user: userId, isActive: true })
      .populate('university')
      .sort({ createdAt: -1 });

    return { success: true, universities: memberships };
  }

  async getUniversityById(universityId: string) {
    const university = await this.universityModel.findById(universityId);
    if (!university) {
      throw new NotFoundException('University not found');
    }
    return { success: true, university };
  }

  async updateUniversity(universityId: string, updates: any) {
    delete updates.username;
    delete updates.createdBy;

    const university = await this.universityModel.findByIdAndUpdate(
      universityId,
      { $set: updates },
      { new: true, runValidators: true },
    );
    return { success: true, university };
  }
}
