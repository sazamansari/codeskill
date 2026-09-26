import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';
import * as xlsx from 'xlsx';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../database/schemas/user.schema';
import { AuditLog, AuditLogDocument } from '../database/schemas/audit-log.schema';
import { EmailJob, EmailJobDocument } from '../database/schemas/email-job.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentsDto } from './dto/query-students.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
    @InjectModel(EmailJob.name)
    private readonly emailJobModel: Model<EmailJobDocument>,
    @InjectQueue('credential-email')
    private readonly credentialEmailQueue: Queue,
  ) {}

  private generateSecurePassword(length = 12): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    const bytes = crypto.randomBytes(length);
    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars[bytes[i] % chars.length];
    }
    // Ensure at least one uppercase, lowercase, digit, and special char
    return pass + 'A1!';
  }

  async findAll(query: QueryStudentsDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = {
      $or: [
        { isAssessmentStudent: true },
        { uid: { $exists: true, $ne: null } },
      ],
    };

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$and = [
        {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { uid: searchRegex },
            { 'studentProfile.department': searchRegex },
            { 'studentProfile.batch': searchRegex },
          ],
        },
      ];
    }

    if (query.department && query.department.trim()) {
      filter['studentProfile.department'] = query.department.trim();
    }

    if (query.batch && query.batch.trim()) {
      filter['studentProfile.batch'] = query.batch.trim();
    }

    if (query.semester !== undefined && !isNaN(Number(query.semester))) {
      filter['studentProfile.semester'] = Number(query.semester);
    }

    if (query.isActive !== undefined && query.isActive !== '') {
      filter.isActive = query.isActive === 'true';
    }

    const [students, total, activeCount, pendingPasswordResetCount] =
      await Promise.all([
        this.userModel
          .find(filter)
          .select('-password -mfaSecret')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.userModel.countDocuments(filter),
        this.userModel.countDocuments({
          ...filter,
          isActive: true,
        }),
        this.userModel.countDocuments({
          ...filter,
          forcePasswordChange: true,
        }),
      ]);

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        total,
        active: activeCount,
        pendingPasswordChange: pendingPasswordResetCount,
      },
    };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid student ID');
    }
    const student = await this.userModel
      .findById(id)
      .select('-password -mfaSecret');
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async create(
    dto: CreateStudentDto,
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    const formattedUid = dto.uid.toUpperCase().trim();
    const formattedEmail = dto.email.toLowerCase().trim();

    // Check duplicate UID
    const existingUid = await this.userModel.findOne({ uid: formattedUid });
    if (existingUid) {
      throw new ConflictException(`Student with UID '${formattedUid}' already exists`);
    }

    // Check duplicate email
    const existingEmail = await this.userModel.findOne({
      email: formattedEmail,
    });
    if (existingEmail) {
      throw new ConflictException(
        `User with email '${formattedEmail}' already exists`,
      );
    }

    const rawPassword = dto.password || this.generateSecurePassword();

    const student = new this.userModel({
      name: dto.name.trim(),
      email: formattedEmail,
      uid: formattedUid,
      password: rawPassword,
      role: 'student',
      isAssessmentStudent: true,
      forcePasswordChange:
        dto.forcePasswordChange !== undefined ? dto.forcePasswordChange : true,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      studentProfile: dto.studentProfile || {},
      authProvider: 'local',
    });

    await student.save();

    // Audit log
    await this.auditLogModel.create({
      actorId: adminUser?._id,
      actorEmail: adminUser?.email || 'admin',
      action: 'CREATE_STUDENT',
      target: student._id.toString(),
      targetType: 'User',
      studentId: student._id,
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        uid: student.uid,
        email: student.email,
        name: student.name,
      },
    });

    const studentJson = student.toObject();
    delete (studentJson as any).password;

    return {
      student: studentJson,
      generatedPassword: !dto.password ? rawPassword : null,
    };
  }

  async update(
    id: string,
    dto: UpdateStudentDto,
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    const student = await this.userModel.findById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (dto.uid) {
      const formattedUid = dto.uid.toUpperCase().trim();
      if (formattedUid !== student.uid) {
        const existing = await this.userModel.findOne({
          uid: formattedUid,
          _id: { $ne: student._id },
        });
        if (existing) {
          throw new ConflictException(
            `UID '${formattedUid}' is already in use by another user`,
          );
        }
        student.uid = formattedUid;
      }
    }

    if (dto.email) {
      const formattedEmail = dto.email.toLowerCase().trim();
      if (formattedEmail !== student.email) {
        const existing = await this.userModel.findOne({
          email: formattedEmail,
          _id: { $ne: student._id },
        });
        if (existing) {
          throw new ConflictException(
            `Email '${formattedEmail}' is already in use by another user`,
          );
        }
        student.email = formattedEmail;
      }
    }

    if (dto.name !== undefined) student.name = dto.name.trim();
    if (dto.isActive !== undefined) student.isActive = dto.isActive;
    if (dto.forcePasswordChange !== undefined)
      student.forcePasswordChange = dto.forcePasswordChange;

    if (dto.studentProfile) {
      student.studentProfile = {
        ...((student.studentProfile as any)?.toObject?.() ||
          student.studentProfile ||
          {}),
        ...dto.studentProfile,
      } as any;
    }

    await student.save();

    // Audit log
    await this.auditLogModel.create({
      actorId: adminUser?._id,
      actorEmail: adminUser?.email || 'admin',
      action: 'UPDATE_STUDENT',
      target: student._id.toString(),
      targetType: 'User',
      studentId: student._id,
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        uid: student.uid,
        email: student.email,
        updates: dto,
      },
    });

    const studentJson = student.toObject();
    delete (studentJson as any).password;
    return studentJson;
  }

  async setActiveStatus(
    id: string,
    isActive: boolean,
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    const student = await this.userModel.findById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    student.isActive = isActive;
    await student.save();

    await this.auditLogModel.create({
      actorId: adminUser?._id,
      actorEmail: adminUser?.email || 'admin',
      action: isActive ? 'ACTIVATE_STUDENT' : 'DEACTIVATE_STUDENT',
      target: student._id.toString(),
      targetType: 'User',
      studentId: student._id,
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        uid: student.uid,
        email: student.email,
        isActive,
      },
    });

    return {
      message: `Student successfully ${isActive ? 'activated' : 'deactivated'}`,
      studentId: student._id,
      isActive: student.isActive,
    };
  }

  async resetPassword(
    id: string,
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    const student = await this.userModel.findById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const tempPassword = this.generateSecurePassword(10);
    student.password = tempPassword;
    student.forcePasswordChange = true;
    await student.save();

    // Audit log entry for password reset
    await this.auditLogModel.create({
      actorId: adminUser?._id,
      actorEmail: adminUser?.email || 'admin',
      action: 'RESET_PASSWORD',
      target: student._id.toString(),
      targetType: 'User',
      studentId: student._id,
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        uid: student.uid,
        email: student.email,
        forcePasswordChange: true,
      },
    });

    return {
      message: 'Student password successfully reset',
      temporaryPassword: tempPassword,
      uid: student.uid,
      email: student.email,
      name: student.name,
    };
  }

  async parseAndValidateImport(fileBuffer: Buffer) {
    let workbook: xlsx.WorkBook;
    try {
      workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    } catch (e: any) {
      throw new BadRequestException(
        'Unable to parse spreadsheet file: ' + e.message,
      );
    }

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new BadRequestException(
        'The uploaded spreadsheet contains no sheets',
      );
    }

    const rawRows = xlsx.utils.sheet_to_json<Record<string, any>>(
      workbook.Sheets[firstSheetName],
      { defval: '' },
    );

    if (!rawRows || rawRows.length === 0) {
      throw new BadRequestException('Uploaded sheet is empty');
    }

    // Helper to find column case-insensitively
    const findField = (row: Record<string, any>, aliases: string[]): string => {
      const rowKeys = Object.keys(row);
      for (const alias of aliases) {
        const foundKey = rowKeys.find(
          (k) => k.trim().toLowerCase() === alias.toLowerCase(),
        );
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
          return String(row[foundKey]).trim();
        }
      }
      return '';
    };

    const parsedRows: any[] = [];
    const fileUidMap = new Set<string>();
    const fileEmailMap = new Set<string>();

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const uid = findField(row, [
        'uid',
        'roll_no',
        'rollno',
        'roll number',
        'student_id',
        'studentid',
        'registration_no',
        'reg_no',
        'id',
      ]).toUpperCase();

      const name = findField(row, [
        'name',
        'student_name',
        'student name',
        'full_name',
        'fullname',
      ]);

      const email = findField(row, [
        'email',
        'student_email',
        'student email',
        'email_address',
        'mail',
      ]).toLowerCase();

      const department = findField(row, ['department', 'dept', 'branch']);
      const course = findField(row, ['course', 'degree', 'program']);
      const batch = findField(row, ['batch', 'year_of_study']);
      const section = findField(row, ['section', 'sec']);
      const group = findField(row, ['group', 'grp']);
      const university = findField(row, [
        'university',
        'college',
        'institution',
      ]);

      const rawSem = findField(row, ['semester', 'sem']);
      const semester = rawSem && !isNaN(Number(rawSem)) ? Number(rawSem) : 1;

      const rawYear = findField(row, [
        'year',
        'grad_year',
        'graduation_year',
      ]);
      const year =
        rawYear && !isNaN(Number(rawYear))
          ? Number(rawYear)
          : new Date().getFullYear();

      const password = findField(row, [
        'password',
        'temp_password',
        'temporary_password',
        'pass',
      ]);

      parsedRows.push({
        rowNumber: i + 2, // 1-indexed header is row 1
        uid,
        name,
        email,
        department,
        course,
        batch,
        section,
        group,
        university,
        semester,
        year,
        password: password || undefined,
      });
    }

    const allFileUids = parsedRows.map((r) => r.uid).filter(Boolean);
    const allFileEmails = parsedRows.map((r) => r.email).filter(Boolean);

    const [existingUsersByUid, existingUsersByEmail] = await Promise.all([
      this.userModel
        .find({ uid: { $in: allFileUids } })
        .select('uid')
        .lean(),
      this.userModel
        .find({ email: { $in: allFileEmails } })
        .select('email')
        .lean(),
    ]);

    const existingUidSet = new Set(existingUsersByUid.map((u) => u.uid));
    const existingEmailSet = new Set(
      existingUsersByEmail.map((u) => u.email.toLowerCase()),
    );

    const emailRegex = /^\S+@\S+\.\S+$/;
    const errors: {
      row: number;
      uid?: string;
      email?: string;
      error: string;
    }[] = [];
    const validRows: any[] = [];
    let duplicates = 0;
    let invalid = 0;

    for (const row of parsedRows) {
      const rowErrors: string[] = [];

      if (!row.uid) {
        rowErrors.push('UID is missing');
      } else if (fileUidMap.has(row.uid)) {
        rowErrors.push(`Duplicate UID '${row.uid}' within the uploaded file`);
      } else if (existingUidSet.has(row.uid)) {
        rowErrors.push(`UID '${row.uid}' already exists in database`);
      }

      if (!row.name) {
        rowErrors.push('Student name is missing');
      }

      if (!row.email) {
        rowErrors.push('Email is missing');
      } else if (!emailRegex.test(row.email)) {
        rowErrors.push(`Invalid email format '${row.email}'`);
      } else if (fileEmailMap.has(row.email)) {
        rowErrors.push(`Duplicate email '${row.email}' within the uploaded file`);
      } else if (existingEmailSet.has(row.email)) {
        rowErrors.push(`Email '${row.email}' already exists in database`);
      }

      if (row.uid) fileUidMap.add(row.uid);
      if (row.email) fileEmailMap.add(row.email);

      if (rowErrors.length > 0) {
        const isDuplicate = rowErrors.some(
          (e) => e.includes('already exists') || e.includes('Duplicate'),
        );
        if (isDuplicate) duplicates++;
        else invalid++;

        errors.push({
          row: row.rowNumber,
          uid: row.uid,
          email: row.email,
          error: rowErrors.join('; '),
        });
      } else {
        validRows.push(row);
      }
    }

    return {
      total: parsedRows.length,
      valid: validRows.length,
      invalid,
      duplicates,
      errors,
      previewRows: parsedRows.slice(0, 50),
      validRows,
    };
  }

  async confirmImport(
    validRows: any[],
    adminUser: any,
    ip = '',
    userAgent = '',
  ) {
    if (!validRows || validRows.length === 0) {
      throw new BadRequestException('No valid rows provided for import');
    }

    const salt = await bcrypt.genSalt(10);
    const usersToInsert: any[] = [];
    const emailJobsToInsert: any[] = [];

    for (const row of validRows) {
      const rawPassword =
        row.password && String(row.password).trim()
          ? String(row.password).trim()
          : 'Student@123';
      const hashedPassword = await bcrypt.hash(rawPassword, salt);
      const studentId = new Types.ObjectId();

      usersToInsert.push({
        _id: studentId,
        name: row.name,
        email: row.email,
        uid: row.uid,
        password: hashedPassword,
        role: 'student',
        isAssessmentStudent: true,
        forcePasswordChange: true,
        isActive: true,
        authProvider: 'local',
        studentProfile: {
          university: row.university || '',
          department: row.department || '',
          course: row.course || '',
          semester: row.semester || 1,
          section: row.section || '',
          group: row.group || '',
          batch: row.batch || '',
          year: row.year || new Date().getFullYear(),
        },
      });

      emailJobsToInsert.push({
        studentId,
        uid: row.uid,
        email: row.email,
        name: row.name,
        temporaryPassword: rawPassword,
        status: 'pending',
        retryCount: 0,
        createdBy: adminUser?._id,
      });
    }

    // Insert in batches of 500 for optimal performance (3,200 rows in < 10s)
    const chunkSize = 500;
    for (let i = 0; i < usersToInsert.length; i += chunkSize) {
      const userChunk = usersToInsert.slice(i, i + chunkSize);
      await this.userModel.insertMany(userChunk, { ordered: false });
    }

    for (let i = 0; i < emailJobsToInsert.length; i += chunkSize) {
      const jobChunk = emailJobsToInsert.slice(i, i + chunkSize);
      await this.emailJobModel.insertMany(jobChunk, { ordered: false });
    }

    // Audit log
    await this.auditLogModel.create({
      actorId: adminUser?._id,
      actorEmail: adminUser?.email || 'admin',
      action: 'IMPORT_STUDENTS',
      targetType: 'User',
      ipAddress: ip,
      userAgent: userAgent,
      metadata: {
        importedCount: usersToInsert.length,
        emailJobsCreated: emailJobsToInsert.length,
      },
    });

    return {
      message: `Successfully imported ${usersToInsert.length} students.`,
      importedCount: usersToInsert.length,
      emailJobsCreated: emailJobsToInsert.length,
    };
  }

  async sendCredentials(jobIds?: string[], portalUrl?: string) {
    const filter: any = {};
    if (jobIds && jobIds.length > 0) {
      filter._id = { $in: jobIds.map((id) => new Types.ObjectId(id)) };
    } else {
      filter.status = 'pending';
    }

    const pendingJobs = await this.emailJobModel.find(filter);
    if (!pendingJobs || pendingJobs.length === 0) {
      return {
        enqueuedCount: 0,
        message: 'No eligible credential email jobs found.',
      };
    }

    for (const job of pendingJobs) {
      job.status = 'queued';
      await job.save();

      await this.credentialEmailQueue.add(
        'send-credential',
        {
          emailJobId: job._id.toString(),
          portalUrl,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 1000,
        },
      );
    }

    return {
      enqueuedCount: pendingJobs.length,
      message: `Enqueued ${pendingJobs.length} credential emails for delivery.`,
    };
  }

  async sendIndividualCredential(studentId: string, portalUrl?: string) {
    const student = await this.userModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');

    let emailJob = await this.emailJobModel
      .findOne({ studentId: student._id })
      .sort({ createdAt: -1 });

    if (!emailJob || !emailJob.temporaryPassword) {
      const tempPass = this.generateSecurePassword(10);
      student.password = tempPass;
      student.forcePasswordChange = true;
      await student.save();

      emailJob = await this.emailJobModel.create({
        studentId: student._id,
        uid: student.uid,
        email: student.email,
        name: student.name,
        temporaryPassword: tempPass,
        status: 'queued',
        retryCount: 0,
      });
    } else {
      emailJob.status = 'queued';
      await emailJob.save();
    }

    await this.credentialEmailQueue.add(
      'send-credential',
      {
        emailJobId: emailJob._id.toString(),
        portalUrl,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );

    return {
      success: true,
      message: `Credential email enqueued for ${student.name} (${student.uid})`,
      jobId: emailJob._id,
    };
  }

  async retryFailedCredentials(portalUrl?: string) {
    const failedJobs = await this.emailJobModel.find({ status: 'failed' });
    if (!failedJobs || failedJobs.length === 0) {
      return {
        retriedCount: 0,
        message: 'No failed credential email jobs found.',
      };
    }

    for (const job of failedJobs) {
      job.status = 'queued';
      await job.save();

      await this.credentialEmailQueue.add(
        'send-credential',
        {
          emailJobId: job._id.toString(),
          portalUrl,
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      );
    }

    return {
      retriedCount: failedJobs.length,
      message: `Re-enqueued ${failedJobs.length} failed credential emails for processing.`,
    };
  }

  async getEmailStatus(page = 1, limit = 20, status?: string) {
    const skip = (Math.max(1, page) - 1) * limit;
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const [total, pending, queued, sent, failed, retrying, jobs, filteredTotal] =
      await Promise.all([
        this.emailJobModel.countDocuments(),
        this.emailJobModel.countDocuments({ status: 'pending' }),
        this.emailJobModel.countDocuments({ status: 'queued' }),
        this.emailJobModel.countDocuments({ status: 'sent' }),
        this.emailJobModel.countDocuments({ status: 'failed' }),
        this.emailJobModel.countDocuments({ status: 'retrying' }),
        this.emailJobModel
          .find(filter)
          .sort({ updatedAt: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.emailJobModel.countDocuments(filter),
      ]);

    return {
      stats: {
        total,
        pending,
        queued,
        sent,
        failed,
        retrying,
      },
      jobs,
      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages: Math.ceil(filteredTotal / limit) || 1,
      },
    };
  }
}

