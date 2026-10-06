import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ExamSecurityService } from './exam-security.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('exam-security')
@UseGuards(JwtAuthGuard)
export class ExamSecurityController {
  constructor(private readonly examSecurityService: ExamSecurityService) {}

  @Post(':assessmentId/secure-session/init')
  @HttpCode(200)
  async initSession(
    @Param('assessmentId') assessmentId: string,
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.examSecurityService.initSecureSession(
      assessmentId,
      req.user._id,
      req.headers,
      body,
    );
  }

  @Post('session/:sessionId/heartbeat')
  @HttpCode(200)
  async heartbeat(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.examSecurityService.processHeartbeat(sessionId, req.user._id);
  }

  @Post('session/:sessionId/violation')
  @HttpCode(200)
  async reportViolation(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
    @Body() body: { eventType: string; metadata?: any },
  ) {
    return this.examSecurityService.reportViolation(
      sessionId,
      req.user._id,
      body.eventType,
      body.metadata || {},
    );
  }
}
