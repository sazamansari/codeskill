import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
import {
  Question,
  QuestionDocument,
} from '../database/schemas/question.schema';
import type { Response } from 'express';
import { renderToStream } from '@react-pdf/renderer';
import { StudentResultReport, StudentResult } from './student-result.pdf.js';
import * as React from 'react';

@Controller('reports')
export class ReportsController {
  constructor(
    @InjectModel(AssessmentAttempt.name)
    private attemptModel: Model<AssessmentAttemptDocument>,
    @InjectModel(Assessment.name)
    private assessmentModel: Model<AssessmentDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  @Get('assessment-attempt/:attemptId')
  async getStudentResultReport(
    @Param('attemptId') attemptId: string,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(attemptId)) {
      throw new BadRequestException('Invalid attempt ID');
    }

    const attempt = await this.attemptModel.findById(attemptId).lean();
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const assessment = await this.assessmentModel
      .findById(attempt.assessmentId)
      .lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // Populate question details for responses
    const questions = await Promise.all(
      (attempt.responses || []).map(async (resp) => {
        const q = await this.questionModel.findById(resp.questionId).lean();
        const item: { id: string; title: string; difficulty: string; status: 'Passed' | 'Failed' | 'Partial'; points: number } = {
          id: resp.questionId.toString(),
          title: q && q.title ? q.title : 'Unknown Question',
          difficulty: q && q.difficulty ? q.difficulty : 'Medium',
          status: resp.isCorrect ? 'Passed' : (resp.marksAwarded > 0 ? 'Partial' : 'Failed'),
          points: resp.marksAwarded || 0,
        };
        return item;
      }),
    );

    const resultData: StudentResult = {
      studentName: attempt.studentName || 'Unknown Student',
      studentEmail: attempt.studentEmail || 'No Email',
      examName: assessment.title,
      dateTaken: attempt.startedAt
        ? new Date(attempt.startedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Unknown Date',
      score: attempt.score || 0,
      maxScore: attempt.maxScore || 100,
      duration: `${Math.floor((attempt.timeSpentSeconds || 0) / 60)}m ${(attempt.timeSpentSeconds || 0) % 60}s`,
      questions,
    };

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="result-${attempt.studentUid}.pdf"`,
    });

    try {
      const stream = await renderToStream(
        React.createElement(StudentResultReport, { result: resultData }) as any,
      );
      stream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error generating PDF');
    }
  }
}
