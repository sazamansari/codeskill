import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Assessment,
  AssessmentDocument,
} from '../database/schemas/assessment.schema';
import {
  AssessmentAttempt,
  AssessmentAttemptDocument,
} from '../database/schemas/assessment-attempt.schema';
import {
  Question,
  QuestionDocument,
} from '../database/schemas/question.schema';
import {
  AuditLog,
  AuditLogDocument,
} from '../database/schemas/audit-log.schema';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectModel(Assessment.name)
    private readonly assessmentModel: Model<AssessmentDocument>,
    @InjectModel(AssessmentAttempt.name)
    private readonly attemptModel: Model<AssessmentAttemptDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  // -------------------------------------------------------------
  // ADMIN METHODS
  // -------------------------------------------------------------

  async create(dto: CreateAssessmentDto, adminUser: any, ip = '', userAgent = '') {
    // 1. Verify question IDs exist
    const questionObjIds = dto.questionIds.map((id) => new Types.ObjectId(id));
    const questions = await this.questionModel.find({ _id: { $in: questionObjIds } });

    if (questions.length === 0) {
      throw new BadRequestException('At least one valid question must be selected.');
    }

    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    const passingMarks = dto.passingMarks ?? Math.ceil(totalMarks * 0.4); // 40% default passing

    const code = (dto.code || `TEST-${Date.now().toString().slice(-6)}`).toUpperCase().trim();

    const existingCode = await this.assessmentModel.findOne({ code });
    if (existingCode) {
      throw new BadRequestException(`Assessment code '${code}' is already in use.`);
    }

    const assessment = new this.assessmentModel({
      title: dto.title.trim(),
      code,
      description: dto.description || '',
      type: dto.type || 'mcq',
      category: dto.category || 'exam',
      durationMinutes: dto.durationMinutes,
      totalMarks,
      passingMarks,
      negativeMarking: dto.negativeMarking ?? true,
      questions: questionObjIds,
      targetBatches: dto.targetBatches || [],
      targetDepartments: dto.targetDepartments || [],
      targetCourses: dto.targetCourses || [],
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      shuffleQuestions: dto.shuffleQuestions ?? true,
      shuffleOptions: dto.shuffleOptions ?? true,
      showResultImmediately: dto.showResultImmediately ?? true,
      allowReview: dto.allowReview ?? true,
      proctoring: dto.proctoring || {
        enforceFullscreen: true,
        blockCopyPaste: true,
        detectTabSwitch: true,
        maxTabSwitches: 3,
        autoSubmitOnViolation: true,
      },
      instructions: dto.instructions || [
        'Ensure a stable internet connection throughout the test duration.',
        'Fullscreen mode is strictly enforced. Leaving fullscreen or switching tabs will be recorded.',
        'Negative marking applies for incorrect answers where specified.',
        'The assessment will automatically submit when the countdown reaches zero.',
      ],
      status: 'published',
      createdBy: adminUser._id,
    });

    await assessment.save();

    await this.auditLogModel.create({
      actorId: adminUser._id,
      actorEmail: adminUser.email,
      action: 'CREATE_ASSESSMENT',
      target: assessment._id.toString(),
      targetType: 'Assessment',
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        title: assessment.title,
        code: assessment.code,
        questionCount: questionObjIds.length,
        totalMarks,
      },
    });

    return assessment;
  }

  async findAll(query: any = {}) {
    const filter: any = {};
    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    } else {
      filter.status = { $ne: 'archived' };
    }
    if (query.search && query.search.trim()) {
      filter.$or = [
        { title: new RegExp(query.search.trim(), 'i') },
        { code: new RegExp(query.search.trim(), 'i') },
      ];
    }

    const assessments = await this.assessmentModel
      .find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, assessments, count: assessments.length };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }
    const assessment = await this.assessmentModel
      .findById(id)
      .populate('questions')
      .populate('createdBy', 'name email')
      .lean();

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
    return { success: true, assessment };
  }

  async delete(id: string, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }
    const assessment = await this.assessmentModel.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true },
    );
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
    return { success: true, message: 'Assessment archived successfully' };
  }

  async update(id: string, dto: UpdateAssessmentDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }

    const assessment = await this.assessmentModel.findById(id);
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    if (dto.title !== undefined) assessment.title = dto.title;
    if (dto.code !== undefined) assessment.code = dto.code.toUpperCase().trim();
    if (dto.description !== undefined) assessment.description = dto.description;
    if (dto.durationMinutes !== undefined) assessment.durationMinutes = dto.durationMinutes;
    if (dto.passingMarks !== undefined) assessment.passingMarks = dto.passingMarks;
    if (dto.negativeMarking !== undefined) assessment.negativeMarking = dto.negativeMarking;
    if (dto.startTime !== undefined) assessment.startTime = dto.startTime ? new Date(dto.startTime) : undefined;
    if (dto.endTime !== undefined) assessment.endTime = dto.endTime ? new Date(dto.endTime) : undefined;
    if (dto.status !== undefined) assessment.status = dto.status as any;
    if (dto.shuffleQuestions !== undefined) assessment.shuffleQuestions = dto.shuffleQuestions;
    if (dto.shuffleOptions !== undefined) assessment.shuffleOptions = dto.shuffleOptions;
    if (dto.showResultImmediately !== undefined) assessment.showResultImmediately = dto.showResultImmediately;
    if (dto.allowReview !== undefined) assessment.allowReview = dto.allowReview;

    if (dto.proctoring) {
      assessment.proctoring = {
        ...assessment.proctoring,
        ...dto.proctoring,
      };
    }

    if (dto.questionIds && Array.isArray(dto.questionIds)) {
      const qIds = dto.questionIds
        .filter((qId) => Types.ObjectId.isValid(qId))
        .map((qId) => new Types.ObjectId(qId));
      assessment.questions = qIds;
      const questionsList = await this.questionModel.find({ _id: { $in: qIds } }).lean();
      assessment.totalMarks = questionsList.reduce((sum, q) => sum + (q.marks || 1), 0);
    }

    await assessment.save();

    await this.auditLogModel.create({
      action: 'UPDATE_ASSESSMENT',
      actorId: adminUser._id,
      actorEmail: adminUser.email || '',
      targetType: 'Assessment',
      assessmentId: assessment._id,
      target: assessment.title,
    });

    return {
      success: true,
      message: 'Assessment updated successfully',
      assessment,
    };
  }

  async updateStatus(id: string, status: string, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }

    const assessment = await this.assessmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    await this.auditLogModel.create({
      action: 'TOGGLE_ASSESSMENT_STATUS',
      actorId: adminUser._id,
      actorEmail: adminUser.email || '',
      targetType: 'Assessment',
      assessmentId: assessment._id,
      target: `Status -> ${status}`,
    });

    return {
      success: true,
      message: `Assessment status updated to ${status}`,
      assessment,
    };
  }

  async getAssessmentResults(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }
    const assessment = await this.assessmentModel.findById(id).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const attempts = await this.attemptModel
      .find({ assessmentId: new Types.ObjectId(id) })
      .sort({ score: -1, timeSpentSeconds: 1 })
      .lean();

    // Summary Analytics
    const totalCandidates = attempts.length;
    const submittedCount = attempts.filter((a) => a.status === 'submitted' || a.status === 'auto_submitted').length;
    const passedCount = attempts.filter((a) => a.passed).length;
    const avgScore = totalCandidates > 0
      ? (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalCandidates).toFixed(1)
      : 0;

    return {
      success: true,
      assessment: {
        id: assessment._id,
        title: assessment.title,
        code: assessment.code,
        totalMarks: assessment.totalMarks,
        passingMarks: assessment.passingMarks,
      },
      stats: {
        totalCandidates,
        submittedCount,
        passedCount,
        passPercentage: totalCandidates > 0 ? ((passedCount / totalCandidates) * 100).toFixed(1) : 0,
        avgScore: Number(avgScore),
      },
      attempts,
    };
  }

  // -------------------------------------------------------------
  // STUDENT CANDIDATE METHODS
  // -------------------------------------------------------------

  async getStudentAssessments(studentUser: any) {
    const studentProfile = studentUser.studentProfile || {};
    const batch = studentProfile.batch || '';
    const dept = studentProfile.department || '';

    // Filter assessments targeted to this student's cohort or universally open (empty target arrays)
    const filter: any = {
      status: { $in: ['published', 'ongoing'] },
      $and: [
        {
          $or: [
            { targetBatches: { $size: 0 } },
            { targetBatches: batch },
          ],
        },
        {
          $or: [
            { targetDepartments: { $size: 0 } },
            { targetDepartments: dept },
          ],
        },
      ],
    };

    const assessments = await this.assessmentModel
      .find(filter)
      .select('-instructions')
      .sort({ createdAt: -1 })
      .lean();

    // Check student's attempt status for each assessment
    const assessmentIds = assessments.map((a) => a._id);
    const existingAttempts = await this.attemptModel
      .find({
        assessmentId: { $in: assessmentIds },
        studentId: studentUser._id,
      })
      .lean();

    const attemptsMap = new Map(existingAttempts.map((att) => [att.assessmentId.toString(), att]));

    const items = assessments.map((a) => {
      const attempt = attemptsMap.get(a._id.toString());
      return {
        ...a,
        questionCount: a.questions?.length || 0,
        attemptStatus: attempt ? attempt.status : 'not_started',
        attemptScore: attempt ? attempt.score : null,
        attemptPassed: attempt ? attempt.passed : null,
      };
    });

    return { success: true, assessments: items };
  }

  async getStudentAssessmentOverview(id: string, studentUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }
    const assessment = await this.assessmentModel.findById(id).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const existingAttempt = await this.attemptModel
      .findOne({
        assessmentId: new Types.ObjectId(id),
        studentId: studentUser._id,
      })
      .lean();

    const now = new Date();
    let isAvailable = assessment.status === 'published' || assessment.status === 'ongoing';
    let unavailabilityReason = '';

    if (assessment.status === 'draft') {
      isAvailable = false;
      unavailabilityReason = 'Assessment is currently in draft mode (disabled by administrator).';
    } else if (assessment.status === 'completed' || assessment.status === 'archived') {
      isAvailable = false;
      unavailabilityReason = 'Assessment has concluded and is closed.';
    } else if (assessment.startTime && now < new Date(assessment.startTime)) {
      isAvailable = false;
      unavailabilityReason = `Assessment window has not opened yet. Scheduled to open at ${new Date(assessment.startTime).toLocaleString()}.`;
    } else if (assessment.endTime && now > new Date(assessment.endTime)) {
      isAvailable = false;
      unavailabilityReason = 'Assessment submission deadline has passed.';
    }

    return {
      success: true,
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        code: assessment.code,
        description: assessment.description,
        type: assessment.type,
        status: assessment.status,
        startTime: assessment.startTime,
        endTime: assessment.endTime,
        isAvailable,
        unavailabilityReason,
        durationMinutes: assessment.durationMinutes,
        totalMarks: assessment.totalMarks,
        passingMarks: assessment.passingMarks,
        negativeMarking: assessment.negativeMarking,
        questionCount: assessment.questions.length,
        proctoring: assessment.proctoring,
        instructions: assessment.instructions,
      },
      attempt: existingAttempt
        ? {
            status: existingAttempt.status,
            score: existingAttempt.score,
            percentage: existingAttempt.percentage,
            passed: existingAttempt.passed,
            startedAt: existingAttempt.startedAt,
            submittedAt: existingAttempt.submittedAt,
          }
        : null,
    };
  }

  async startStudentAttempt(id: string, studentUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }
    const assessment = await this.assessmentModel.findById(id).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // Scheduling and Admin Availability Check
    if (assessment.status === 'draft' || assessment.status === 'archived') {
      throw new BadRequestException('This assessment is currently disabled by administrator.');
    }
    const now = new Date();
    if (assessment.startTime && now < new Date(assessment.startTime)) {
      throw new BadRequestException(`Assessment has not started yet. Scheduled to begin at ${new Date(assessment.startTime).toLocaleString()}.`);
    }
    if (assessment.endTime && now > new Date(assessment.endTime)) {
      throw new BadRequestException('Assessment window has expired. Submissions are closed.');
    }

    const questionsList = await this.questionModel.find({
      _id: { $in: assessment.questions },
    }).lean();

    let attempt = await this.attemptModel.findOne({
      assessmentId: new Types.ObjectId(id),
      studentId: studentUser._id,
    });

    if (attempt && (attempt.status === 'submitted' || attempt.status === 'auto_submitted')) {
      throw new BadRequestException('You have already submitted this assessment.');
    }

    if (!attempt) {
      // Shuffle question order if enabled
      let orderedIds = questionsList.map((q) => q._id);
      if (assessment.shuffleQuestions) {
        orderedIds = [...orderedIds].sort(() => Math.random() - 0.5);
      }

      attempt = new this.attemptModel({
        assessmentId: assessment._id,
        studentId: studentUser._id,
        studentUid: studentUser.uid || 'UNKNOWN',
        studentName: studentUser.name || 'Student Candidate',
        studentEmail: studentUser.email || '',
        status: 'in_progress',
        startedAt: new Date(),
        questionOrder: orderedIds,
        maxScore: assessment.totalMarks,
        responses: orderedIds.map((qId) => ({
          questionId: qId,
          selectedAnswer: -1,
          isCorrect: false,
          marksAwarded: 0,
          timeSpentSeconds: 0,
          status: 'unvisited',
        })),
      });

      await attempt.save();
    }

    // SANITIZATION: Strictly strip correctAnswer and explanation to prevent question leakage!
    const qMap = new Map(questionsList.map((q) => [q._id.toString(), q]));
    const sanitizedQuestions = attempt.questionOrder.map((qId, index) => {
      const q = qMap.get(qId.toString());
      if (!q) return null;
      return {
        _id: q._id,
        questionIndex: index + 1,
        question: q.question,
        questionType: q.questionType,
        topic: q.topic,
        subtopic: q.subtopic,
        difficulty: q.difficulty,
        marks: q.marks || 1,
        negativeMarks: assessment.negativeMarking ? (q.negativeMarks || 0) : 0,
        options: Array.isArray(q.options)
          ? q.options.map((opt: any) =>
              typeof opt === 'string' ? opt : opt?.text || String(opt || '')
            )
          : [],
        codeSnippet: q.codeSnippet,
        language: q.language,
      };
    }).filter(Boolean);

    return {
      success: true,
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      durationMinutes: assessment.durationMinutes,
      proctoring: assessment.proctoring,
      questions: sanitizedQuestions,
      savedResponses: attempt.responses,
    };
  }

  async saveProgress(id: string, dto: SubmitAssessmentDto, studentUser: any) {
    const attempt = await this.attemptModel.findOne({
      assessmentId: new Types.ObjectId(id),
      studentId: studentUser._id,
      status: 'in_progress',
    });

    if (!attempt) {
      throw new BadRequestException('No active attempt found for this assessment.');
    }

    if (dto.responses && Array.isArray(dto.responses)) {
      attempt.responses = dto.responses.map((r) => ({
        questionId: new Types.ObjectId(r.questionId),
        selectedAnswer: r.selectedAnswer,
        isCorrect: false,
        marksAwarded: 0,
        timeSpentSeconds: r.timeSpentSeconds || 0,
        status: r.status || (r.selectedAnswer >= 0 ? 'answered' : 'unvisited'),
      }));
    }

    if (dto.timeSpentSeconds) {
      attempt.timeSpentSeconds = dto.timeSpentSeconds;
    }

    if (dto.violations && Array.isArray(dto.violations)) {
      attempt.violations = dto.violations.map((v) => ({
        type: v.type,
        timestamp: v.timestamp ? new Date(v.timestamp) : new Date(),
        details: v.details || '',
      }));
      attempt.tabSwitchCount = attempt.violations.filter((v) => v.type === 'tab_switch').length;
    }

    await attempt.save();
    return { success: true, message: 'Progress saved successfully.' };
  }

  async submitAttempt(id: string, dto: SubmitAssessmentDto, studentUser: any) {
    const assessment = await this.assessmentModel.findById(id).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const attempt = await this.attemptModel.findOne({
      assessmentId: new Types.ObjectId(id),
      studentId: studentUser._id,
    });

    if (!attempt) {
      throw new BadRequestException('Attempt not found.');
    }

    if (attempt.status === 'submitted' || attempt.status === 'auto_submitted') {
      return this.getStudentResult(id, studentUser);
    }

    // SERVER-SIDE EVALUATION
    const questions = await this.questionModel.find({
      _id: { $in: assessment.questions },
    }).lean();
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let totalScore = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;

    const evaluatedResponses = (dto.responses || []).map((r) => {
      const q = questionMap.get(r.questionId.toString());
      if (!q) {
        return {
          questionId: new Types.ObjectId(r.questionId),
          selectedAnswer: r.selectedAnswer,
          isCorrect: false,
          marksAwarded: 0,
          timeSpentSeconds: r.timeSpentSeconds || 0,
          status: 'skipped',
        };
      }

      const isAttempted = r.selectedAnswer !== undefined && r.selectedAnswer >= 0;
      let isCorrect = false;
      let marksAwarded = 0;

      if (isAttempted) {
        totalAttempted++;
        if (r.selectedAnswer === q.correctAnswer) {
          isCorrect = true;
          marksAwarded = q.marks || 1;
          totalCorrect++;
        } else {
          isCorrect = false;
          const negMarks = assessment.negativeMarking ? (q.negativeMarks || 0) : 0;
          marksAwarded = -negMarks;
          totalWrong++;
        }
      } else {
        totalSkipped++;
      }

      totalScore += marksAwarded;

      return {
        questionId: q._id,
        selectedAnswer: r.selectedAnswer ?? -1,
        isCorrect,
        marksAwarded,
        timeSpentSeconds: r.timeSpentSeconds || 0,
        status: isAttempted ? (isCorrect ? 'answered' : 'answered') : 'skipped',
      };
    });

    // Ensure non-negative overall floor if institutional rule applies
    const finalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const maxScore = assessment.totalMarks || 1;
    const percentage = Math.round((finalScore / maxScore) * 1000) / 10;
    const passed = finalScore >= (assessment.passingMarks || 0);
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    // Proctoring violations
    const violations = (dto.violations || []).map((v) => ({
      type: v.type,
      timestamp: v.timestamp ? new Date(v.timestamp) : new Date(),
      details: v.details || '',
    }));
    const tabSwitches = violations.filter((v) => v.type === 'tab_switch').length;

    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    attempt.timeSpentSeconds = dto.timeSpentSeconds || 0;
    attempt.responses = evaluatedResponses;
    attempt.score = finalScore;
    attempt.maxScore = maxScore;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.totalAttempted = totalAttempted;
    attempt.totalCorrect = totalCorrect;
    attempt.totalWrong = totalWrong;
    attempt.totalSkipped = totalSkipped;
    attempt.accuracy = accuracy;
    attempt.tabSwitchCount = tabSwitches;
    attempt.violations = violations;

    await attempt.save();

    return {
      success: true,
      message: 'Assessment submitted successfully.',
      result: {
        score: finalScore,
        maxScore,
        percentage,
        passed,
        accuracy,
        totalAttempted,
        totalCorrect,
        totalWrong,
        totalSkipped,
        timeSpentSeconds: attempt.timeSpentSeconds,
      },
    };
  }

  async getStudentResult(id: string, studentUser: any) {
    const assessment = await this.assessmentModel.findById(id).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const attempt = await this.attemptModel.findOne({
      assessmentId: new Types.ObjectId(id),
      studentId: studentUser._id,
    }).lean();

    if (!attempt || attempt.status === 'in_progress') {
      throw new BadRequestException('No completed assessment attempt found.');
    }

    const questions = await this.questionModel.find({
      _id: { $in: assessment.questions },
    }).lean();
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    // Topic-wise accuracy breakdown
    const topicStats: Record<string, { total: number; correct: number; marks: number }> = {};

    const reviewQuestions = attempt.responses.map((resp) => {
      const q = questionMap.get(resp.questionId.toString());
      if (!q) return null;

      const topic = q.topic || 'General';
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0, marks: 0 };
      }
      topicStats[topic].total++;
      if (resp.isCorrect) {
        topicStats[topic].correct++;
      }
      topicStats[topic].marks += resp.marksAwarded;

      return {
        questionId: q._id,
        question: q.question,
        options: q.options,
        selectedAnswer: resp.selectedAnswer,
        correctAnswer: assessment.allowReview ? q.correctAnswer : undefined,
        explanation: assessment.allowReview ? q.explanation : undefined,
        isCorrect: resp.isCorrect,
        marksAwarded: resp.marksAwarded,
        topic: q.topic,
        difficulty: q.difficulty,
      };
    }).filter(Boolean);

    const topicBreakdown = Object.entries(topicStats).map(([topic, stat]) => ({
      topic,
      total: stat.total,
      correct: stat.correct,
      accuracy: Math.round((stat.correct / stat.total) * 100),
      marksEarned: stat.marks,
    }));

    return {
      success: true,
      assessment: {
        title: assessment.title,
        code: assessment.code,
        totalMarks: assessment.totalMarks,
        passingMarks: assessment.passingMarks,
        allowReview: assessment.allowReview,
      },
      attempt: {
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        passed: attempt.passed,
        accuracy: attempt.accuracy,
        totalAttempted: attempt.totalAttempted,
        totalCorrect: attempt.totalCorrect,
        totalWrong: attempt.totalWrong,
        totalSkipped: attempt.totalSkipped,
        timeSpentSeconds: attempt.timeSpentSeconds,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        tabSwitchCount: attempt.tabSwitchCount,
      },
      topicBreakdown,
      reviewQuestions: assessment.allowReview ? reviewQuestions : [],
    };
  }
}
