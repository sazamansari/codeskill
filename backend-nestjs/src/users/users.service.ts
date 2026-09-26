import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import {
  ProblemMetadata,
  ProblemMetadataDocument,
} from '../database/schemas/problem-metadata.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ProblemMetadata.name)
    private problemMetadataModel: Model<ProblemMetadataDocument>,
  ) {}

  async getPublicProfile(identifier: string) {
    let user;

    // Check if identifier is a valid MongoDB ObjectId or a username
    if (isValidObjectId(identifier)) {
      user = await this.userModel
        .findById(identifier)
        .select('-password -email -resetPasswordToken -resetPasswordExpire')
        .lean();
    }
    if (!user) {
      user = await this.userModel
        .findOne({ username: identifier.toLowerCase() })
        .select('-password -email -resetPasswordToken -resetPasswordExpire')
        .lean();
    }

    if (!user) return null;

    // Fetch problem details for the problems this user has solved
    // Assuming user.solvedProblems contains problem slugs
    let solvedProblemsDetails: any[] = [];
    if (user.solvedProblems && user.solvedProblems.length > 0) {
      solvedProblemsDetails = await this.problemMetadataModel
        .find({ slug: { $in: user.solvedProblems } })
        .select('slug title difficulty tags acceptanceRate')
        .lean();
    }

    return {
      ...user,
      solvedProblemsDetails,
    };
  }
}
