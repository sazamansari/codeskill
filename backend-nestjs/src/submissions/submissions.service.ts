import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Submission,
  SubmissionDocument,
} from '../database/schemas/submission.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectQueue('submissions') private submissionQueue: Queue,
  ) {}

  async createSubmission(userId: string, data: any) {
    // Override status to pending for background processing
    const submission = await this.submissionModel.create({
      user: userId,
      ...data,
      status: data.status || 'pending',
    });

    // Enqueue the submission for processing by the judge worker
    await this.submissionQueue.add('evaluate-code', {
      submissionId: submission._id,
      problemId: data.problemId,
      code: data.code,
      language: data.language,
      userId,
    });

    const user = await this.userModel.findById(userId);
    if (user) {
      user.stats.totalSubmissions += 1;
      if (data.status === 'accepted') {
        user.stats.acceptedSubmissions += 1;
        // Additional badge/XP logic would go here
      }
      if (user.updateStreak) {
        user.updateStreak();
      }
      await user.save();
    }

    return submission;
  }

  async getSubmissionsByProblem(userId: string, problemId: string) {
    return this.submissionModel
      .find({ user: userId, problemId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
  }

  async getRecentSubmissions(userId: string) {
    return this.submissionModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
  }

  async getUserStats(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('stats badges activityMap name avatar');
    if (!user) throw new NotFoundException('User not found');

    const totalSubmissions = await this.submissionModel.countDocuments({
      user: userId,
    });
    const acceptedSubmissions = await this.submissionModel.countDocuments({
      user: userId,
      status: 'accepted',
    });

    return {
      user,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate:
        totalSubmissions > 0
          ? (acceptedSubmissions / totalSubmissions) * 100
          : 0,
    };
  }
}
