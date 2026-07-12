import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExecutionService } from './execution.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Execution')
@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('run')
  @ApiOperation({ summary: 'Execute code without saving a submission' })
  async runCode(@Body() body: any) {
    const { language, code, testCases, config = {} } = body;

    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return {
        success: false,
        message: 'Missing code, language, or testCases',
      };
    }

    try {
      const startTime = Date.now();
      const results = await this.executionService.executeCode(
        language,
        code,
        testCases,
        config,
      );
      const runtime = Date.now() - startTime;

      const passedCount = results.filter((r: any) => r.passed).length;
      const hasError = results.some((r: any) => r.error);
      const allPassed = passedCount === results.length;

      return {
        success: true,
        status: hasError ? 'error' : allPassed ? 'accepted' : 'wrong_answer',
        results,
        runtime,
        passedCount,
        totalCount: results.length,
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Execution failed' };
    }
  }
}
