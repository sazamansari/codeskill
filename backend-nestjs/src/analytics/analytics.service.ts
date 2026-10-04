import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AssessmentAttempt,
  AssessmentAttemptDocument,
} from '../database/schemas/assessment-attempt.schema';
import {
  Assessment,
  AssessmentDocument,
} from '../database/schemas/assessment.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AssessmentAttempt.name)
    private attemptModel: Model<AssessmentAttemptDocument>,
    @InjectModel(Assessment.name)
    private assessmentModel: Model<AssessmentDocument>,
  ) {}

  async getAssessmentOverview(assessmentId: string) {
    const objectId = new Types.ObjectId(assessmentId);
    const assessment = await this.assessmentModel.findById(objectId);
    if (!assessment) throw new NotFoundException('Assessment not found');

    const totalAttempts = await this.attemptModel.countDocuments({
      assessmentId: objectId,
    });
    const completedAttempts = await this.attemptModel.countDocuments({
      assessmentId: objectId,
      status: { $in: ['submitted', 'auto_submitted', 'timed_out'] },
    });

    // Aggregations
    const stats = await this.attemptModel.aggregate([
      {
        $match: {
          assessmentId: objectId,
          status: { $in: ['submitted', 'auto_submitted', 'timed_out'] },
        },
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' },
          avgTimeSpent: { $avg: '$timeSpentSeconds' },
          totalPassed: { $sum: { $cond: [{ $eq: ['$passed', true] }, 1, 0] } },
        },
      },
    ]);

    return {
      assessment: {
        title: assessment.title,
        status: assessment.status,
      },
      participation: {
        total: totalAttempts,
        completed: completedAttempts,
      },
      metrics: stats[0] || {
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        avgTimeSpent: 0,
        totalPassed: 0,
      },
    };
  }

  async getAssessmentLeaderboard(assessmentId: string, page = 1, limit = 20) {
    const objectId = new Types.ObjectId(assessmentId);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.attemptModel
        .find({
          assessmentId: objectId,
          status: { $in: ['submitted', 'auto_submitted', 'timed_out'] },
        })
        .sort({ score: -1, timeSpentSeconds: 1 })
        .skip(skip)
        .limit(limit)
        .select(
          'studentName studentEmail studentUid score maxScore percentage passed timeSpentSeconds startedAt submittedAt violations tabSwitchCount fullscreenExitCount',
        )
        .lean(),
      this.attemptModel.countDocuments({
        assessmentId: objectId,
        status: { $in: ['submitted', 'auto_submitted', 'timed_out'] },
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getQuestionAnalytics(assessmentId: string) {
    const objectId = new Types.ObjectId(assessmentId);

    // Aggregation pipeline to unwind responses and calculate stats per question
    const questionStats = await this.attemptModel.aggregate([
      {
        $match: {
          assessmentId: objectId,
          status: { $in: ['submitted', 'auto_submitted', 'timed_out'] },
        },
      },
      { $unwind: '$responses' },
      {
        $group: {
          _id: '$responses.questionId',
          totalAttempts: { $sum: 1 },
          correctCount: {
            $sum: { $cond: [{ $eq: ['$responses.isCorrect', true] }, 1, 0] },
          },
          avgTimeSpent: { $avg: '$responses.timeSpentSeconds' },
          avgMarksAwarded: { $avg: '$responses.marksAwarded' },
        },
      },
      {
        $lookup: {
          from: 'questions', // MongoDB collection name for Question
          localField: '_id',
          foreignField: '_id',
          as: 'questionDetails',
        },
      },
      { $unwind: '$questionDetails' },
      {
        $project: {
          questionId: '$_id',
          title: '$questionDetails.title',
          type: '$questionDetails.questionType',
          difficulty: '$questionDetails.difficulty',
          totalAttempts: 1,
          correctCount: 1,
          successRate: {
            $cond: [
              { $eq: ['$totalAttempts', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$correctCount', '$totalAttempts'] },
                  100,
                ],
              },
            ],
          },
          avgTimeSpent: 1,
          avgMarksAwarded: 1,
        },
      },
      { $sort: { successRate: 1 } }, // Sort by hardest first
    ]);

    return questionStats;
  }
}
