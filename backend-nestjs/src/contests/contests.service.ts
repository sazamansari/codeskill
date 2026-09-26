import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contest, ContestDocument } from '../database/schemas/contest.schema';
import {
  ContestAttempt,
  ContestAttemptDocument,
} from '../database/schemas/contest-attempt.schema';

@Injectable()
export class ContestsService {
  constructor(
    @InjectModel(Contest.name) private contestModel: Model<ContestDocument>,
    @InjectModel(ContestAttempt.name)
    private attemptModel: Model<ContestAttemptDocument>,
  ) {}

  async getContests() {
    return this.contestModel
      .find({ isPublished: true, isPrivate: false })
      .select('-password -antiCheatConfig')
      .sort({ startTime: -1 })
      .lean();
  }

  async getContest(slug: string) {
    const contest = await this.contestModel
      .findOne({ slug, isPublished: true })
      .select('-password')
      .populate('problems', 'title slug difficulty stats')
      .lean();
    if (!contest) throw new NotFoundException('Contest not found');
    return contest;
  }

  async register(contestId: string, userId: string, password?: string) {
    const contest = await this.contestModel.findById(contestId);
    if (!contest) throw new NotFoundException('Contest not found');

    if (contest.isPrivate && contest.password !== password) {
      throw new Error('Invalid contest password');
    }

    if (!contest.participants.includes(userId as any)) {
      contest.participants.push(userId as any);
      await contest.save();
    }

    return { success: true };
  }
}
