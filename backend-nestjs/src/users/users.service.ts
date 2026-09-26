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

  private getTier(xp: number): string {
    if (xp >= 50000) return 'Grandmaster';
    if (xp >= 30000) return 'Master';
    if (xp >= 15000) return 'Expert';
    if (xp >= 8000) return 'Specialist';
    if (xp >= 3000) return 'Competent';
    if (xp >= 1000) return 'Learner';
    return 'Beginner';
  }

  async getLeaderboard(limit = 50) {
    const users = await this.userModel
      .find({ isActive: true, role: { $ne: 'admin' } })
      .select('name username uid avatar stats studentProfile')
      .sort({ 'stats.xp': -1 })
      .limit(limit)
      .lean();

    const leaderboard = users.map((u, idx) => ({
      rank: idx + 1,
      _id: u._id,
      name: u.name,
      username: u.username,
      uid: u.uid,
      avatar: u.avatar || '',
      xp: u.stats?.xp ?? 0,
      totalSolved: u.stats?.totalSolved ?? 0,
      currentStreak: u.stats?.currentStreak ?? 0,
      tier: this.getTier(u.stats?.xp ?? 0),
      department: u.studentProfile?.department || '',
      batch: u.studentProfile?.batch || '',
    }));

    return { success: true, leaderboard, total: leaderboard.length };
  }

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
