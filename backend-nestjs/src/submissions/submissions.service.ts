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
    const { status: _untrustedStatus, runtime: _untrustedRuntime, memory: _untrustedMemory, testCasesPassed: _untrustedPassed, totalTestCases: _untrustedTotal, ...submissionData } = data;

    // The client can only request evaluation. It cannot declare its own result.
    const submission = await this.submissionModel.create({
      user: userId,
      ...submissionData,
      status: 'pending',
    });

    await this.submissionQueue.add(
      'evaluate-code',
      {
        submissionId: submission._id,
        problemId: submissionData.problemId,
        code: submissionData.code,
        language: submissionData.language,
        userId,
      },
      {
        jobId: String(submission._id),
        attempts: 2,
        backoff: { type: 'exponential', delay: 2_000 },
        removeOnComplete: { age: 24 * 60 * 60 },
        removeOnFail: { age: 7 * 24 * 60 * 60 },
      },
    );

    await this.userModel.updateOne(
      { _id: userId },
      { $inc: { 'stats.totalSubmissions': 1 } },
    );

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
