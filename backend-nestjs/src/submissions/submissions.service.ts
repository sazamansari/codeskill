import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Submission,
  SubmissionDocument,
  SubmissionStatus,
} from '../database/schemas/submission.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppGateway } from '../gateway/app.gateway';
import { RedisService } from '../redis/redis.service';
import { SUPPORTED_LANGUAGES } from '../execution/execution.types';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectQueue('submissions') private submissionQueue: Queue,
    private readonly appGateway: AppGateway,
    private readonly redisService: RedisService,
  ) {}

  async createSubmission(userId: string, data: any) {
    const {
      status: _untrustedStatus,
      runtime: _untrustedRuntime,
      memory: _untrustedMemory,
      testCasesPassed: _untrustedPassed,
      totalTestCases: _untrustedTotal,
      ...submissionData
    } = data;

    if (!submissionData.code || typeof submissionData.code !== 'string') {
      throw new BadRequestException('Missing or invalid code');
    }
    if (!submissionData.language || typeof submissionData.language !== 'string') {
      throw new BadRequestException('Missing or invalid language');
    }
    if (!submissionData.problemId) {
      throw new BadRequestException('Missing problemId');
    }

    const langLower = submissionData.language.toLowerCase();
    if (!SUPPORTED_LANGUAGES.includes(langLower as any)) {
      throw new BadRequestException(
        `Unsupported language: "${submissionData.language}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}`,
      );
    }

    if (Buffer.byteLength(submissionData.code, 'utf8') > 1_000_000) {
      throw new BadRequestException('Source code exceeds the 1MB limit');
    }

    // 1. Create submission in MongoDB with status 'queued'
    const submission = await this.submissionModel.create({
      user: userId,
      ...submissionData,
      status: SubmissionStatus.QUEUED,
      queuedAt: new Date(),
    });

    // 2. Increment active running jobs for user in Redis
    const client = this.redisService.getClient();
    if (client) {
      await client.incr(`active:submissions:${userId}`);
      await client.expire(`active:submissions:${userId}`, 120); // 2 min auto-expiry safety
    }

    // 3. Enqueue to BullMQ runner queue
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
        removeOnComplete: { age: 24 * 60 * 60, count: 5000 },
        removeOnFail: { age: 7 * 24 * 60 * 60, count: 5000 },
      },
    );

    // 4. Update user's submission count stats
    await this.userModel.updateOne(
      { _id: userId },
      { $inc: { 'stats.totalSubmissions': 1 } },
    );

    // 5. Broadcast initial queued status via WebSocket
    this.appGateway.emitToUser(userId, 'submission_status', {
      submissionId: submission._id,
      status: SubmissionStatus.QUEUED,
      problemId: submissionData.problemId,
      queuedAt: submission.queuedAt,
    });

    return submission;
  }

  async getSubmissionById(userId: string, submissionId: string, isAdmin = false) {
    const submission = await this.submissionModel.findById(submissionId).lean();
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check ownership unless admin
    if (!isAdmin && String(submission.user) !== String(userId)) {
      throw new ForbiddenException('Access denied to this submission');
    }

    return submission;
  }

  async getSubmissionResult(userId: string, submissionId: string, isAdmin = false) {
    const submission = await this.getSubmissionById(userId, submissionId, isAdmin);

    return {
      submissionId: submission._id,
      status: submission.status,
      runtime: submission.runtime,
      memory: submission.memory,
      testCasesPassed: submission.testCasesPassed,
      totalTestCases: submission.totalTestCases,
      compileOutput: submission.compileOutput,
      testResults: submission.testResults || [],
      queuedAt: submission.queuedAt,
      startedAt: submission.startedAt,
      completedAt: submission.completedAt,
    };
  }

  async cancelSubmission(userId: string, submissionId: string, isAdmin = false) {
    const submission = await this.submissionModel.findById(submissionId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (!isAdmin && String(submission.user) !== String(userId)) {
      throw new ForbiddenException('Access denied to this submission');
    }

    if (submission.status !== SubmissionStatus.QUEUED && submission.status !== 'pending') {
      throw new BadRequestException(
        `Cannot cancel submission with status "${submission.status}". Only queued submissions can be cancelled.`,
      );
    }

    // Attempt to remove from BullMQ
    try {
      const job = await this.submissionQueue.getJob(submissionId);
      if (job) {
        await job.remove();
      }
    } catch (err: any) {
      this.logger.warn(`Could not remove job ${submissionId} from queue: ${err.message}`);
    }

    submission.status = SubmissionStatus.CANCELLED;
    submission.completedAt = new Date();
    await submission.save();

    // Decrement active count in Redis
    const client = this.redisService.getClient();
    if (client) {
      await client.decr(`active:submissions:${userId}`);
    }

    this.appGateway.emitToUser(userId, 'submission_status', {
      submissionId: submission._id,
      status: SubmissionStatus.CANCELLED,
      message: 'Submission cancelled by user',
    });

    return { success: true, message: 'Submission cancelled successfully' };
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

  async getSubmissionsByUser(
    userId: string,
    query: { page?: number; limit?: number; problemId?: string; status?: string },
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { user: userId };
    if (query.problemId) filter.problemId = query.problemId;
    if (query.status) filter.status = query.status;

    const [submissions, total] = await Promise.all([
      this.submissionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.submissionModel.countDocuments(filter),
    ]);

    return {
      submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
