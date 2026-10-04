import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Question,
  QuestionDocument,
} from '../database/schemas/question.schema';
import {
  QuestionBank,
  QuestionBankDocument,
} from '../database/schemas/question-bank.schema';
import {
  AuditLog,
  AuditLogDocument,
} from '../database/schemas/audit-log.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryQuestionsDto } from './dto/query-questions.dto';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(QuestionBank.name)
    private readonly questionBankModel: Model<QuestionBankDocument>,
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async findAll(query: QueryQuestionsDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    } else {
      filter.status = { $ne: 'archived' };
    }

    if (query.topic && query.topic.trim()) {
      filter.topic = query.topic.trim();
    }

    if (query.subtopic && query.subtopic.trim()) {
      filter.subtopic = query.subtopic.trim();
    }

    if (query.difficulty && query.difficulty !== 'all') {
      filter.difficulty = query.difficulty;
    }

    if (query.aiGenerated !== undefined && query.aiGenerated !== '') {
      filter.aiGenerated = query.aiGenerated === 'true';
    }

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { question: searchRegex },
        { topic: searchRegex },
        { subtopic: searchRegex },
        { tags: searchRegex },
      ];
    }

    const [questions, total, pendingCount, approvedCount] = await Promise.all([
      this.questionModel
        .find(filter)
        .populate('createdBy', 'name email')
        .populate('approvedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.questionModel.countDocuments(filter),
      this.questionModel.countDocuments({ status: 'pending' }),
      this.questionModel.countDocuments({ status: 'approved' }),
    ]);

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        total,
        pending: pendingCount,
        approved: approvedCount,
      },
    };
  }

  async findById(id: string, isStudent = false) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid question ID');
    }

    const question = await this.questionModel.findById(id).lean();
    if (!question || question.status === 'archived') {
      throw new NotFoundException('Question not found');
    }

    // Question Leakage Prevention: NEVER send answers or hidden data to students
    if (isStudent) {
      const {
        correctAnswer,
        correctAnswers,
        explanation,
        expectedOutput,
        referenceSolutions,
        metadata,
        ...studentSafeQuestion
      } = question as any;

      if (studentSafeQuestion.testCases) {
        studentSafeQuestion.testCases = studentSafeQuestion.testCases.filter(
          (tc: any) => !tc.isHidden,
        );
      }

      return studentSafeQuestion;
    }

    return question;
  }

  async create(
    dto: CreateQuestionDto,
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    if (dto.correctAnswer! < 0 || dto.correctAnswer! >= dto.options!.length) {
      throw new BadRequestException(
        `correctAnswer must be a valid zero-based index between 0 and ${dto.options!.length - 1}`,
      );
    }

    const question = new this.questionModel({
      ...dto,
      createdBy: adminUser._id,
      status: 'approved', // Manually created admin questions are approved by default
      approvedBy: adminUser._id,
      approvedAt: new Date(),
    });

    await question.save();

    await this.auditLogModel.create({
      actorId: adminUser._id,
      actorEmail: adminUser.email,
      action: 'CREATE_QUESTION',
      target: question._id.toString(),
      targetType: 'Question',
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        topic: question.topic,
        difficulty: question.difficulty,
      },
    });

    return question;
  }

  async update(
    id: string,
    dto: UpdateQuestionDto,
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    const question = await this.questionModel.findById(id);
    if (!question || question.status === 'archived') {
      throw new NotFoundException('Question not found');
    }

    const options = dto.options || question.options;
    const correctAnswer =
      dto.correctAnswer !== undefined
        ? dto.correctAnswer
        : question.correctAnswer;

    if (correctAnswer < 0 || correctAnswer >= options.length) {
      throw new BadRequestException(
        `correctAnswer must be a valid index between 0 and ${options.length - 1}`,
      );
    }

    Object.assign(question, dto);
    await question.save();

    await this.auditLogModel.create({
      actorId: adminUser._id,
      actorEmail: adminUser.email,
      action: 'UPDATE_QUESTION',
      target: question._id.toString(),
      targetType: 'Question',
      ipAddress: ip,
      userAgent: userAgent,
      metadata: { updates: dto },
    });

    return question;
  }

  async delete(id: string, adminUser: any, ip = '', userAgent = '') {
    const question = await this.questionModel.findById(id);
    if (!question) throw new NotFoundException('Question not found');

    // Soft delete
    question.status = 'archived';
    await question.save();

    await this.auditLogModel.create({
      actorId: adminUser._id,
      actorEmail: adminUser.email,
      action: 'DELETE_QUESTION',
      target: question._id.toString(),
      targetType: 'Question',
      ipAddress: ip,
      userAgent: userAgent,
    });

    return { success: true, message: 'Question successfully archived' };
  }

  async review(
    id: string,
    status: 'approved' | 'rejected',
    reason = '',
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    const question = await this.questionModel.findById(id);
    if (!question) throw new NotFoundException('Question not found');

    question.status = status;
    if (status === 'approved') {
      question.approvedBy = adminUser._id;
      question.approvedAt = new Date();
      question.rejectedReason = undefined;
    } else {
      question.rejectedReason =
        reason || 'Declined during administrative review';
    }

    await question.save();

    await this.auditLogModel.create({
      actorId: adminUser._id,
      actorEmail: adminUser.email,
      action: status === 'approved' ? 'APPROVE_QUESTION' : 'REJECT_QUESTION',
      target: question._id.toString(),
      targetType: 'Question',
      ipAddress: ip,
      userAgent: userAgent,
      metadata: { reason },
    });

    return question;
  }

  async getTopicsDistribution() {
    const topicsAggregation = await this.questionModel.aggregate([
      { $match: { status: { $ne: 'archived' } } },
      {
        $group: {
          _id: '$topic',
          total: { $sum: 1 },
          easy: {
            $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] },
          },
          medium: {
            $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] },
          },
          hard: {
            $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] },
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return topicsAggregation.map((t) => ({
      topic: t._id || 'Unassigned',
      total: t.total,
      easy: t.easy,
      medium: t.medium,
      hard: t.hard,
      approved: t.approved,
      pending: t.pending,
    }));
  }

  // --- Question Bank Collection Methods ---

  async findAllBanks(topic?: string) {
    const filter: any = {};
    if (topic) filter.topic = topic;

    return this.questionBankModel
      .find(filter)
      .populate('createdBy', 'name email')
      .populate({
        path: 'questions',
        select: 'question topic difficulty marks options',
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findBankById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid ID');
    const bank = await this.questionBankModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('questions')
      .lean();
    if (!bank) throw new NotFoundException('Question Bank not found');
    return bank;
  }

  async createBank(dto: CreateQuestionBankDto, adminUser: any) {
    const bank = new this.questionBankModel({
      ...dto,
      questions: (dto.questions || []).map((qId) => new Types.ObjectId(qId)),
      createdBy: adminUser._id,
    });
    return bank.save();
  }

  async updateBank(id: string, dto: Partial<CreateQuestionBankDto>) {
    const bank = await this.questionBankModel.findById(id);
    if (!bank) throw new NotFoundException('Question Bank not found');
    if (dto.questions) {
      bank.questions = dto.questions.map((q) => new Types.ObjectId(q));
    }
    if (dto.name) bank.name = dto.name;
    if (dto.description !== undefined) bank.description = dto.description;
    if (dto.topic) bank.topic = dto.topic;
    if (dto.isPublic !== undefined) bank.isPublic = dto.isPublic;
    if (dto.tags) bank.tags = dto.tags;

    return bank.save();
  }

  async deleteBank(id: string) {
    const res = await this.questionBankModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Question Bank not found');
    return { success: true, message: 'Question Bank removed' };
  }

  // --- Bulk Question Import (XLSX / CSV) ---

  async parseAndValidateQuestionsImport(fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new BadRequestException(
        'The uploaded spreadsheet contains no sheets.',
      );
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      throw new BadRequestException(
        'The uploaded spreadsheet contains no data rows.',
      );
    }

    const normalizeHeader = (str: string) =>
      str.toLowerCase().replace(/[\s\-_.]/g, '');

    const findField = (row: any, aliases: string[]) => {
      const keys = Object.keys(row);
      const normalizedAliases = aliases.map(normalizeHeader);
      for (const key of keys) {
        if (normalizedAliases.includes(normalizeHeader(key))) {
          const val = row[key];
          return typeof val === 'string' ? val.trim() : String(val).trim();
        }
      }
      return '';
    };

    const parsedRows: any[] = [];
    const fileQuestionSet = new Set<string>();

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const question = findField(row, [
        'question',
        'question_text',
        'question_statement',
        'problem_statement',
        'problem',
        'title',
      ]);
      const rawQuestionType =
        findField(row, ['question_type', 'type', 'qtype']) || 'single_choice';
      const topic =
        findField(row, ['topic', 'subject', 'category']) || 'General';
      const subtopic = findField(row, ['subtopic', 'sub_topic', 'chapter']);
      const difficulty = (
        findField(row, ['difficulty', 'level']) || 'medium'
      ).toLowerCase();

      const rawMarks = findField(row, ['marks', 'mark', 'score', 'points']);
      const marks = rawMarks && !isNaN(Number(rawMarks)) ? Number(rawMarks) : 1;

      const rawNeg = findField(row, [
        'negative_marks',
        'negative_mark',
        'negative',
        'penalty',
      ]);
      const negativeMarks =
        rawNeg && !isNaN(Number(rawNeg)) ? Number(rawNeg) : 0;

      const optA = findField(row, [
        'option_a',
        'optiona',
        'option_1',
        'opt_a',
        'a',
      ]);
      const optB = findField(row, [
        'option_b',
        'optionb',
        'option_2',
        'opt_b',
        'b',
      ]);
      const optC = findField(row, [
        'option_c',
        'optionc',
        'option_3',
        'opt_c',
        'c',
      ]);
      const optD = findField(row, [
        'option_d',
        'optiond',
        'option_4',
        'opt_d',
        'd',
      ]);
      const optE = findField(row, [
        'option_e',
        'optione',
        'option_5',
        'opt_e',
        'e',
      ]);

      const correctAnswerRaw = findField(row, [
        'correct_answer',
        'correct',
        'answer',
        'key',
        'ans',
      ]);
      const explanation = findField(row, [
        'explanation',
        'solution',
        'rationale',
      ]);
      const codeSnippet = findField(row, [
        'code_snippet',
        'code',
        'snippet',
        'starter_code',
        'startercode',
      ]);
      const language = findField(row, ['language', 'lang']) || 'general';
      const rawTags = findField(row, ['tags', 'tag']);
      const tags = rawTags
        ? rawTags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      // Algorithmic / Coding specific columns
      const constraints = findField(row, [
        'constraints',
        'constraint',
        'limits',
      ]);
      const timeLimitRaw = findField(row, [
        'time_limit',
        'timelimit',
        'time_limit_ms',
      ]);
      const timeLimit =
        timeLimitRaw && !isNaN(Number(timeLimitRaw))
          ? Number(timeLimitRaw)
          : 2000;
      const memoryLimitRaw = findField(row, [
        'memory_limit',
        'memorylimit',
        'memory_limit_mb',
      ]);
      const memoryLimit =
        memoryLimitRaw && !isNaN(Number(memoryLimitRaw))
          ? Number(memoryLimitRaw)
          : 256;

      // Extract test cases
      const testCases: Array<{
        input: string;
        output: string;
        isHidden?: boolean;
        explanation?: string;
      }> = [];
      for (let tcIdx = 1; tcIdx <= 10; tcIdx++) {
        const inp = findField(row, [
          `test_input_${tcIdx}`,
          `testinput${tcIdx}`,
          `input_${tcIdx}`,
          `in_${tcIdx}`,
        ]);
        const out = findField(row, [
          `test_output_${tcIdx}`,
          `testoutput${tcIdx}`,
          `output_${tcIdx}`,
          `out_${tcIdx}`,
        ]);
        if (inp || out) {
          testCases.push({
            input: inp,
            output: out,
            isHidden: tcIdx > 2,
          });
        }
      }
      const rawTestCasesJson = findField(row, [
        'test_cases',
        'testcases',
        'testcase',
        'tests',
      ]);
      if (rawTestCasesJson) {
        try {
          const parsedTc = JSON.parse(rawTestCasesJson);
          if (Array.isArray(parsedTc)) {
            testCases.push(...parsedTc);
          }
        } catch (e) {
          // ignore invalid JSON
        }
      }

      const isCoding =
        ['coding', 'algorithmic', 'algorithm', 'code', 'dsa'].includes(
          rawQuestionType.toLowerCase(),
        ) || testCases.length > 0;
      const questionType = isCoding ? 'coding' : rawQuestionType.toLowerCase();

      parsedRows.push({
        rowNumber: i + 2,
        question,
        questionType,
        topic,
        subtopic,
        difficulty: ['easy', 'medium', 'hard'].includes(difficulty)
          ? difficulty
          : 'medium',
        marks,
        negativeMarks,
        optA,
        optB,
        optC,
        optD,
        optE,
        correctAnswerRaw,
        explanation,
        codeSnippet,
        language,
        tags,
        constraints,
        timeLimit,
        memoryLimit,
        testCases,
        isCoding,
      });
    }

    const allFileQuestions = parsedRows.map((r) => r.question).filter(Boolean);
    const existingDbQuestions = await this.questionModel
      .find({
        question: { $in: allFileQuestions },
        status: { $ne: 'archived' },
      })
      .select('question topic')
      .lean();

    const dbQuestionMap = new Set(
      existingDbQuestions.map(
        (q) => `${q.topic.toLowerCase()}:::${q.question.toLowerCase().trim()}`,
      ),
    );

    const errors: { row: number; question?: string; error: string }[] = [];
    const validRows: any[] = [];
    let duplicatesInFile = 0;
    let willUpdateCount = 0;
    let willInsertCount = 0;
    let invalid = 0;

    for (const row of parsedRows) {
      const rowErrors: string[] = [];

      if (!row.question) {
        rowErrors.push('Question statement is missing');
      } else {
        const questionKey = `${row.topic.toLowerCase()}:::${row.question.toLowerCase().trim()}`;
        if (fileQuestionSet.has(questionKey)) {
          rowErrors.push(
            'Duplicate question statement within the uploaded file',
          );
          duplicatesInFile++;
        } else {
          fileQuestionSet.add(questionKey);
          if (dbQuestionMap.has(questionKey)) {
            row.isUpdate = true;
            willUpdateCount++;
          } else {
            row.isUpdate = false;
            willInsertCount++;
          }
        }
      }

      if (!row.topic) {
        rowErrors.push('Topic is required');
      }

      const isChoice = ['single_choice', 'multiple_choice'].includes(
        row.questionType,
      );
      let formattedOptions: Array<{
        text: string;
        isCorrect: boolean;
        explanation?: string;
      }> = [];

      if (isChoice) {
        // Enforce min 2 options
        const rawOptions = [
          { key: 'A', text: row.optA },
          { key: 'B', text: row.optB },
          { key: 'C', text: row.optC },
          { key: 'D', text: row.optD },
          ...(row.optE ? [{ key: 'E', text: row.optE }] : []),
        ].filter((o) => o.text && o.text.trim());

        if (rawOptions.length < 2) {
          rowErrors.push(
            'Multiple choice questions require at least 2 populated options',
          );
        }

        if (!row.correctAnswerRaw) {
          rowErrors.push('Correct answer is missing');
        } else {
          const rawAnswerParts = row.correctAnswerRaw
            .toUpperCase()
            .split(/[,/|]/)
            .map((s: string) => s.trim());

          formattedOptions = rawOptions.map((opt, idx) => {
            const matchesKey = rawAnswerParts.includes(opt.key);
            const matchesNumeric = rawAnswerParts.includes(String(idx + 1));
            const matchesText = rawAnswerParts.some(
              (ans: string) => ans.toLowerCase() === opt.text.toLowerCase(),
            );
            return {
              text: opt.text,
              isCorrect: matchesKey || matchesNumeric || matchesText,
            };
          });

          const correctCount = formattedOptions.filter(
            (o) => o.isCorrect,
          ).length;
          if (correctCount === 0) {
            rowErrors.push(
              `Correct answer '${row.correctAnswerRaw}' did not match any of options (A, B, C, D)`,
            );
          } else if (row.questionType === 'single_choice' && correctCount > 1) {
            rowErrors.push(
              'Single choice question cannot have multiple correct answers',
            );
          }
        }
      }

      if (rowErrors.length > 0) {
        invalid++;
        errors.push({
          row: row.rowNumber,
          question: row.question || `Row ${row.rowNumber}`,
          error: rowErrors.join('. '),
        });
      } else {
        validRows.push({
          rowNumber: row.rowNumber,
          question: row.question,
          questionType: row.questionType,
          topic: row.topic,
          subtopic: row.subtopic || undefined,
          difficulty: row.difficulty,
          marks: row.marks,
          negativeMarks: row.negativeMarks,
          options: isChoice ? formattedOptions : undefined,
          explanation: row.explanation || undefined,
          codeSnippet: row.codeSnippet || undefined,
          language: row.language !== 'general' ? row.language : undefined,
          tags: row.tags,
          constraints: row.constraints,
          timeLimit: row.timeLimit,
          memoryLimit: row.memoryLimit,
          testCases: row.testCases,
          isUpdate: row.isUpdate,
          status: 'approved',
        });
      }
    }

    return {
      summary: {
        totalRows: parsedRows.length,
        validCount: validRows.length,
        invalidCount: invalid,
        duplicateCount: duplicatesInFile,
        toInsertCount: willInsertCount,
        toUpdateCount: willUpdateCount,
      },
      validRows,
      errors,
    };
  }

  async confirmQuestionsImport(
    validRows: any[],
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    if (!validRows || validRows.length === 0) {
      throw new BadRequestException('No valid question rows to import.');
    }

    const docs = validRows.map((r) => {
      let optionsList: string[] = [];
      let correctAnswerIndex = 0;
      if (Array.isArray(r.options)) {
        optionsList = r.options.map((o: any) =>
          typeof o === 'string' ? o : o.text || '',
        );
        const correctIdx = r.options.findIndex(
          (o: any) => typeof o === 'object' && o.isCorrect,
        );
        correctAnswerIndex = correctIdx >= 0 ? correctIdx : 0;
      }

      return {
        question: r.question,
        questionType: r.questionType || 'single_choice',
        topic: r.topic,
        subtopic: r.subtopic || '',
        difficulty: r.difficulty || 'medium',
        marks: r.marks || 1,
        negativeMarks: r.negativeMarks || 0,
        options: optionsList,
        correctAnswer: correctAnswerIndex,
        explanation: r.explanation || '',
        codeSnippet: r.codeSnippet || '',
        language: r.language || 'general',
        tags: r.tags || [],
        status: 'approved',
        createdBy: adminUser?._id,
        approvedBy: adminUser?._id,
        approvedAt: new Date(),
        metadata: {
          importedVia: 'bulk_csv',
          originalRow: r.rowNumber,
          constraints: r.constraints || '',
          timeLimit: r.timeLimit || 2000,
          memoryLimit: r.memoryLimit || 256,
          testCases: r.testCases || [],
        },
      };
    });

    // High performance bulkWrite with upsert
    const operations = docs.map((doc) => ({
      updateOne: {
        filter: {
          question: doc.question,
          topic: doc.topic,
        },
        update: {
          $set: {
            ...doc,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const chunkSize = 250;
    let totalUpserted = 0;
    let totalModified = 0;

    for (let i = 0; i < operations.length; i += chunkSize) {
      const chunk = operations.slice(i, i + chunkSize);
      const res = await this.questionModel.bulkWrite(chunk as any, {
        ordered: false,
      });
      totalUpserted += res.upsertedCount || 0;
      totalModified += res.modifiedCount || 0;
    }

    const totalProcessed = docs.length;

    await this.auditLogModel.create({
      actorId: adminUser?._id,
      actorEmail: adminUser?.email || 'admin',
      action: 'BULK_IMPORT_QUESTIONS_UPSERT',
      target: 'Question',
      targetType: 'Question',
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        totalProcessed,
        newlyInserted: totalUpserted,
        updated: totalModified,
        sampleTopics: [...new Set(docs.map((d) => d.topic))].slice(0, 5),
      },
    });

    return {
      success: true,
      message: `Successfully processed ${totalProcessed} questions (${totalUpserted} newly inserted, ${totalModified} updated).`,
      count: totalProcessed,
      insertedCount: totalUpserted,
      updatedCount: totalModified,
    };
  }

  async autoImportQuestions(
    fileBuffer: Buffer,
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    const preview = await this.parseAndValidateQuestionsImport(fileBuffer);
    if (!preview.validRows || preview.validRows.length === 0) {
      throw new BadRequestException(
        preview.errors?.[0]?.error || 'No valid question rows found in file.',
      );
    }
    const commit = await this.confirmQuestionsImport(
      preview.validRows,
      adminUser,
      ip,
      userAgent,
    );
    return {
      success: true,
      message: commit.message,
      summary: {
        ...preview.summary,
        insertedCount: commit.insertedCount,
        updatedCount: commit.updatedCount,
      },
      validCount: preview.validRows.length,
      invalidCount: preview.summary.invalidCount,
      errors: preview.errors,
    };
  }
}
