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
      allowedAttempts: dto.allowedAttempts !== undefined ? Number(dto.allowedAttempts) : 1,
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
    if (dto.allowedAttempts !== undefined) assessment.allowedAttempts = Number(dto.allowedAttempts);
    if (!assessment.createdBy && adminUser?._id) {
      assessment.createdBy = adminUser._id;
    }

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

    // Deduplicate / Aggregate by student: group attempts per unique student
    const studentAttemptsMap = new Map<string, any[]>();
    for (const att of attempts) {
      const studentKey = att.studentId ? att.studentId.toString() : att.studentUid;
      const list = studentAttemptsMap.get(studentKey) || [];
      list.push(att);
      studentAttemptsMap.set(studentKey, list);
    }

    const uniqueCandidates = Array.from(studentAttemptsMap.entries()).map(([key, studentAttempts]) => {
      // Pick best submitted attempt, or latest attempt
      const submitted = studentAttempts.filter((a) => a.status === 'submitted' || a.status === 'auto_submitted');
      const best = submitted.length > 0
        ? [...submitted].sort((a, b) => (b.score || 0) - (a.score || 0))[0]
        : [...studentAttempts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];

      const maxScore = submitted.length > 0
        ? Math.max(...submitted.map((s) => s.score || 0))
        : (best?.score || 0);

      const hasPassed = submitted.length > 0
        ? submitted.some((s) => s.passed)
        : (best?.passed || false);

      return {
        ...best,
        attemptNumber: studentAttempts.length,
        totalAttempts: studentAttempts.length,
        score: maxScore,
        highestScore: maxScore,
        passed: hasPassed,
        allAttempts: studentAttempts
          .sort((a, b) => (a.attemptNumber || 0) - (b.attemptNumber || 0))
          .map((a, idx) => ({
            _id: a._id,
            attemptNumber: a.attemptNumber || idx + 1,
            score: a.score ?? 0,
            maxScore: a.maxScore || assessment.totalMarks || 100,
            status: a.status,
            percentage: a.percentage ?? 0,
            submittedAt: a.submittedAt || (a as any).createdAt || a.startedAt,
            passed: a.passed,
            timeSpentSeconds: a.timeSpentSeconds || 0,
            tabSwitchCount: a.tabSwitchCount || 0,
            violationsCount: a.violations?.length || 0,
            responses: a.responses || [],
            violations: a.violations || [],
          })),
      };
    });

    // Summary Analytics on Unique Candidates
    const totalCandidates = uniqueCandidates.length;
    const submittedCandidates = uniqueCandidates.filter((c) => c.status === 'submitted' || c.status === 'auto_submitted');
    const submittedCount = submittedCandidates.length;
    const passedCount = uniqueCandidates.filter((c) => c.passed).length;
    const avgScore = submittedCount > 0
      ? Number((submittedCandidates.reduce((sum, c) => sum + (c.score || 0), 0) / submittedCount).toFixed(1))
      : 0;

    return {
      success: true,
      assessment: {
        id: assessment._id,
        title: assessment.title,
        code: assessment.code,
        totalMarks: assessment.totalMarks || 100,
        passingMarks: assessment.passingMarks || 40,
        allowedAttempts: assessment.allowedAttempts !== undefined ? assessment.allowedAttempts : 0,
      },
      stats: {
        totalCandidates,
        submittedCount,
        passedCount,
        passPercentage: submittedCount > 0 ? Number(((passedCount / submittedCount) * 100).toFixed(1)) : 0,
        avgScore,
        totalSubmissionsCount: attempts.filter((a) => a.status === 'submitted' || a.status === 'auto_submitted').length,
      },
      attempts: uniqueCandidates,
      rawAttempts: attempts.map((a, idx) => ({
        _id: a._id,
        studentId: a.studentId,
        studentUid: a.studentUid,
        studentName: a.studentName,
        studentEmail: a.studentEmail,
        attemptNumber: a.attemptNumber || idx + 1,
        score: a.score ?? 0,
        maxScore: a.maxScore || assessment.totalMarks || 100,
        percentage: a.percentage ?? 0,
        passed: a.passed,
        status: a.status,
        submittedAt: a.submittedAt || (a as any).createdAt || a.startedAt,
        timeSpentSeconds: a.timeSpentSeconds || 0,
        tabSwitchCount: a.tabSwitchCount || 0,
        violations: a.violations || [],
        responses: a.responses || [],
      })),
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
      .sort({ score: -1, createdAt: -1 })
      .lean();

    const items = assessments.map((a) => {
      const allForAssessment = existingAttempts.filter(
        (att) => att.assessmentId.toString() === a._id.toString()
      );
      const submittedAttempts = allForAssessment.filter(
        (att) => att.status === 'submitted' || att.status === 'auto_submitted'
      );
      const isCompleted = submittedAttempts.length > 0;
      const inProgressAttempt = allForAssessment.find((att) => att.status === 'in_progress');

      // Highest score across all submitted attempts
      const maxScore = isCompleted
        ? Math.max(...submittedAttempts.map((s) => s.score || 0))
        : inProgressAttempt?.score ?? null;

      const hasPassed = isCompleted
        ? submittedAttempts.some((s) => s.passed)
        : false;

      const allowedAttempts = (a as any).allowedAttempts !== undefined ? (a as any).allowedAttempts : 1;
      const completedCount = submittedAttempts.length;
      // 0 = unlimited, 1 = 1 attempt allowed (cannot retake if completed), >1 = multiple attempts up to limit
      const canRetake = allowedAttempts === 0
        ? true
        : completedCount < allowedAttempts;

      return {
        ...a,
        allowedAttempts,
        completedAttemptsCount: completedCount,
        questionCount: a.questions?.length || 0,
        attemptStatus: isCompleted ? 'submitted' : (inProgressAttempt ? 'in_progress' : 'not_started'),
        attemptScore: maxScore,
        attemptPassed: hasPassed,
        highestScore: maxScore,
        totalAttempts: allForAssessment.length,
        canRetake,
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

    const allAttempts = await this.attemptModel
      .find({
        assessmentId: new Types.ObjectId(id),
        studentId: studentUser._id,
      })
      .sort({ score: -1, startedAt: -1 })
      .lean();

    const submittedAttempts = allAttempts.filter(
      (a) => a.status === 'submitted' || a.status === 'auto_submitted',
    );
    const inProgressAttempt = allAttempts.find((a) => a.status === 'in_progress');

    const allowedAttempts = assessment.allowedAttempts !== undefined ? assessment.allowedAttempts : 1;
    const completedCount = submittedAttempts.length;
    // 0 = unlimited attempts, otherwise check completedCount < allowedAttempts
    const canRetake = allowedAttempts === 0 ? true : completedCount < allowedAttempts;
    const highestScore = submittedAttempts.length > 0
      ? Math.max(...submittedAttempts.map((s) => s.score || 0))
      : null;

    const latestAttempt = inProgressAttempt || (allAttempts.length > 0 ? allAttempts[0] : null);

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
        allowedAttempts,
        proctoring: assessment.proctoring,
        instructions: assessment.instructions,
      },
      attempt: latestAttempt
        ? {
            status: latestAttempt.status,
            score: latestAttempt.score,
            percentage: latestAttempt.percentage,
            passed: latestAttempt.passed,
            startedAt: latestAttempt.startedAt,
            submittedAt: latestAttempt.submittedAt,
            attemptNumber: latestAttempt.attemptNumber,
          }
        : null,
      canRetake,
      completedAttemptsCount: completedCount,
      highestScore,
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
      status: 'in_progress',
    });

    if (!attempt) {
      // Check previous submissions to track attempt number and highest score
      const previousSubmitted = await this.attemptModel
        .find({
          assessmentId: new Types.ObjectId(id),
          studentId: studentUser._id,
          status: { $in: ['submitted', 'auto_submitted'] },
        })
        .sort({ score: -1 })
        .lean();

      const allowedAttempts = assessment.allowedAttempts !== undefined ? assessment.allowedAttempts : 1;
      if (allowedAttempts > 0 && previousSubmitted.length >= allowedAttempts) {
        throw new BadRequestException(
          allowedAttempts === 1
            ? 'Only 1 attempt is allowed for this examination and you have already completed it.'
            : `You have reached the maximum limit of ${allowedAttempts} attempts for this examination.`
        );
      }

      const highestPreviousScore = previousSubmitted.length > 0 ? (previousSubmitted[0].score || 0) : 0;
      const attemptNum = previousSubmitted.length + 1;

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
        attemptNumber: attemptNum,
        highestScore: highestPreviousScore,
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
        starterCode: (q.metadata as any)?.starterCode || (q.questionType === 'coding' ? (q.codeSnippet || '') : ''),
        language: q.language || 'python',
        constraints: (q.metadata as any)?.constraints || '',
        timeLimit: (q.metadata as any)?.timeLimit || 2000,
        memoryLimit: (q.metadata as any)?.memoryLimit || 256,
        testCases: (((q.metadata as any)?.testCases || []) as any[])
          .filter((tc: any) => !tc.isHidden)
          .map((tc: any, tcIdx: number) => ({
            id: tc.id || String(tcIdx + 1),
            input: tc.input || '',
            expected: tc.output || tc.expected || '',
            output: tc.output || tc.expected || '',
            explanation: tc.explanation || '',
          })),
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

  async retakeStudentAttempt(id: string, studentUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }
    // Delete any unfinished in_progress attempts only, preserving submitted attempts
    await this.attemptModel.deleteMany({
      assessmentId: new Types.ObjectId(id),
      studentId: studentUser._id,
      status: 'in_progress',
    });
    return this.startStudentAttempt(id, studentUser);
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
        code: r.code || '',
        language: r.language || 'python',
        testCasesPassed: r.testCasesPassed || 0,
        totalTestCases: r.totalTestCases || 0,
        isCorrect: false,
        marksAwarded: 0,
        timeSpentSeconds: r.timeSpentSeconds || 0,
        status: r.status || ((r.selectedAnswer >= 0 || (r.code && r.code.trim().length > 0)) ? 'answered' : 'unvisited'),
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
      status: 'in_progress',
    }).sort({ startedAt: -1 });

    if (!attempt) {
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

      const isCoding = q.questionType === 'coding' || q.questionType === 'algorithmic';
      let isAttempted = false;
      let isCorrect = false;
      let marksAwarded = 0;

      if (isCoding) {
        const hasCode = r.code && r.code.trim().length > 0;
        if (hasCode) {
          isAttempted = true;
          totalAttempted++;
          const passed = Number(r.testCasesPassed) || 0;
          const totalTc = Number(r.totalTestCases) || 1;
          const ratio = Math.min(1, Math.max(0, passed / totalTc));
          marksAwarded = Math.round(ratio * (q.marks || 5) * 10) / 10;
          isCorrect = ratio >= 0.99;
          if (isCorrect) totalCorrect++;
          else if (ratio > 0) totalCorrect++;
          else totalWrong++;
        } else {
          totalSkipped++;
        }
      } else {
        isAttempted = r.selectedAnswer !== undefined && r.selectedAnswer >= 0;
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
      }

      totalScore += marksAwarded;

      return {
        questionId: q._id,
        selectedAnswer: r.selectedAnswer ?? -1,
        code: r.code || '',
        language: r.language || 'python',
        testCasesPassed: r.testCasesPassed || 0,
        totalTestCases: r.totalTestCases || 0,
        isCorrect,
        marksAwarded,
        timeSpentSeconds: r.timeSpentSeconds || 0,
        status: isAttempted ? 'answered' : 'skipped',
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

    // Calculate highest score across all attempts
    const prevAttempts = await this.attemptModel.find({
      assessmentId: new Types.ObjectId(id),
      studentId: studentUser._id,
      status: { $in: ['submitted', 'auto_submitted'] },
      _id: { $ne: attempt._id },
    }).lean();

    const prevMax = prevAttempts.length > 0 ? Math.max(...prevAttempts.map((a) => a.score || 0)) : 0;
    const finalHighestScore = Math.max(finalScore, prevMax);

    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    attempt.timeSpentSeconds = dto.timeSpentSeconds || 0;
    attempt.responses = evaluatedResponses;
    attempt.score = finalScore;
    attempt.highestScore = finalHighestScore;
    attempt.maxScore = maxScore;
    attempt.percentage = percentage;
    attempt.passed = passed || (prevMax >= (assessment.passingMarks || 0));
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
        highestScore: finalHighestScore,
        maxScore,
        percentage,
        passed: attempt.passed,
        accuracy,
        totalAttempted,
        totalCorrect,
        totalWrong,
        totalSkipped,
        timeSpentSeconds: attempt.timeSpentSeconds,
        tabSwitchCount: tabSwitches,
      },
    };
  }

  async getStudentResult(id: string, studentUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid assessment ID');
    }
    const assessment = await this.assessmentModel.findById(id).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const attempt = await this.attemptModel.findOne({
      assessmentId: new Types.ObjectId(id),
      studentId: studentUser._id,
      status: { $in: ['submitted', 'auto_submitted'] },
    }).sort({ score: -1, submittedAt: -1 }).lean();

    if (!attempt) {
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
      canRetake:
        assessment.allowedAttempts === 0
          ? true
          : (await this.attemptModel.countDocuments({
              assessmentId: new Types.ObjectId(id),
              studentId: studentUser._id,
              status: { $in: ['submitted', 'auto_submitted'] },
            })) < (assessment.allowedAttempts !== undefined ? assessment.allowedAttempts : 1),
      assessment: {
        title: assessment.title,
        code: assessment.code,
        totalMarks: assessment.totalMarks,
        passingMarks: assessment.passingMarks,
        allowReview: assessment.allowReview,
        allowedAttempts: assessment.allowedAttempts !== undefined ? assessment.allowedAttempts : 1,
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
