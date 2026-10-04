import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Assessment,
  AssessmentDocument,
} from '../database/schemas/assessment.schema';
import {
  ExamSession,
  ExamSessionDocument,
} from '../database/schemas/exam-session.schema';
import {
  ExamSecurityEvent,
  ExamSecurityEventDocument,
} from '../database/schemas/exam-security-event.schema';

@Injectable()
export class ExamSecurityService {
  constructor(
    @InjectModel(Assessment.name)
    private assessmentModel: Model<AssessmentDocument>,
    @InjectModel(ExamSession.name)
    private sessionModel: Model<ExamSessionDocument>,
    @InjectModel(ExamSecurityEvent.name)
    private eventModel: Model<ExamSecurityEventDocument>,
  ) {}

  async initSecureSession(
    assessmentId: string,
    candidateId: string,
    headers: any,
    clientBody: any,
  ) {
    if (!Types.ObjectId.isValid(assessmentId))
      throw new BadRequestException('Invalid assessment ID');

    const assessment = await this.assessmentModel.findById(assessmentId);
    if (!assessment) throw new NotFoundException('Assessment not found');

    // Check if security is enabled
    const security = assessment.securityPolicy;
    const isSecureMode = security && security.secureExamMode !== 'DISABLED';

    const clientType = clientBody.isSEB ? 'SEB' : 'BROWSER';
    const clientVersion = clientBody.clientVersion || 'UNKNOWN';
    const configKey = clientBody.configKey;

    if (security?.requireSEB && clientType !== 'SEB') {
      throw new ForbiddenException(
        'This assessment requires Safe Exam Browser. Please launch via SEB.',
      );
    }

    if (security?.requireSEB && security.allowedSEBVersions?.length > 0) {
      if (!security.allowedSEBVersions.includes(clientVersion)) {
        throw new ForbiddenException(
          `Your Safe Exam Browser version (${clientVersion}) is not supported for this assessment. Please install an approved version.`,
        );
      }
    }

    // Check if session exists
    let session = await this.sessionModel.findOne({
      assessmentId,
      candidateId,
    });
    if (!session) {
      const expiresAt = new Date(
        Date.now() +
          assessment.durationMinutes * 60 * 1000 +
          (security?.heartbeatGracePeriod || 60) * 1000,
      );
      session = new this.sessionModel({
        assessmentId,
        candidateId,
        status: 'VERIFIED', // SEB config check simulated
        secureMode: security?.secureExamMode || 'DISABLED',
        clientType,
        clientVersion,
        configKey,
        expiresAt,
        startedAt: new Date(),
        lastHeartbeatAt: new Date(),
      });
      await session.save();
    } else {
      if (['SUBMITTED', 'EXPIRED', 'TERMINATED'].includes(session.status)) {
        throw new ForbiddenException('Exam session has already ended.');
      }
      // Re-verify
      session.lastHeartbeatAt = new Date();
      await session.save();
    }

    return {
      success: true,
      sessionId: session._id,
      expiresAt: session.expiresAt,
      status: session.status,
      secureMode: session.secureMode,
      token: 'simulate-secure-token', // In a real scenario, sign a JWT for the session
    };
  }

  async processHeartbeat(sessionId: string, candidateId: string) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session || session.candidateId.toString() !== candidateId) {
      throw new ForbiddenException('Invalid session');
    }

    if (['SUBMITTED', 'EXPIRED', 'TERMINATED'].includes(session.status)) {
      throw new ForbiddenException('Session ended');
    }

    session.lastHeartbeatAt = new Date();
    if (session.status === 'SUSPENDED') {
      session.status = 'ACTIVE';
    }

    await session.save();
    return { success: true, status: session.status };
  }

  async reportViolation(
    sessionId: string,
    candidateId: string,
    eventType: string,
    metadata: any,
  ) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session || session.candidateId.toString() !== candidateId) {
      throw new ForbiddenException('Invalid session');
    }

    const assessment = await this.assessmentModel.findById(
      session.assessmentId,
    );

    const severity = ['TAB_HIDDEN', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT'].includes(
      eventType,
    )
      ? 'WARNING'
      : 'CRITICAL';

    await this.eventModel.create({
      sessionId,
      candidateId,
      assessmentId: session.assessmentId,
      eventType,
      severity,
      metadata,
    });

    session.violationCount += 1;
    const threshold = assessment?.securityPolicy?.violationThreshold || 3;

    if (session.violationCount >= threshold) {
      session.status = 'SUSPENDED';
      session.securityState = 'VIOLATED';
    }

    await session.save();

    return {
      success: true,
      status: session.status,
      violations: session.violationCount,
    };
  }
}
