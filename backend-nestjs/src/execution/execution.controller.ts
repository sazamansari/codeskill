import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ExecutionService, Status } from './execution.service';

@ApiTags('Execution')
@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute code against test cases without saving a submission' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code', 'language', 'testCases'],
      properties: {
        code: { type: 'string', description: 'Source code to execute' },
        language: {
          type: 'string',
          enum: ['c', 'cpp', 'c++', 'java', 'python', 'python3', 'py', 'javascript', 'js', 'node'],
          description: 'Programming language',
        },
        testCases: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              input: { type: 'string', description: 'Stdin input' },
              expected: { type: 'string', description: 'Expected stdout output' },
            },
          },
        },
        config: {
          type: 'object',
          description: 'Optional execution configuration (timeLimit, memoryLimit, etc.)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Execution results',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        status: { type: 'string', enum: Object.values(Status) },
        results: { type: 'array' },
        runtime: { type: 'number' },
        passedCount: { type: 'number' },
        totalCount: { type: 'number' },
      },
    },
  })
  async runCode(@Body() body: any) {
    const { language, code, testCases, config = {} } = body;

    // Validate required fields
    if (!code || typeof code !== 'string') {
      throw new BadRequestException('Missing or invalid "code" field');
    }
    if (!language || typeof language !== 'string') {
      throw new BadRequestException('Missing or invalid "language" field');
    }
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      throw new BadRequestException('Missing or invalid "testCases" array');
    }

    // Validate supported language
    const supportedLanguages = ['c', 'cpp', 'c++', 'java', 'python', 'python3', 'py', 'javascript', 'js', 'node'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      throw new BadRequestException(
        `Unsupported language: "${language}". Supported: ${supportedLanguages.join(', ')}`,
      );
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

      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;
      const allPassed = passedCount === totalCount;

      // Determine overall status
      const hasCompileError = results.some((r) => r.status === Status.COMPILATION_ERROR);
      const hasRuntimeError = results.some((r) => r.status === Status.RUNTIME_ERROR);
      const hasTLE = results.some((r) => r.status === Status.TIME_LIMIT_EXCEEDED);
      const hasSystemError = results.some((r) => r.status === Status.SYSTEM_ERROR);

      let overallStatus: string;
      if (allPassed) {
        overallStatus = Status.ACCEPTED;
      } else if (hasCompileError) {
        overallStatus = Status.COMPILATION_ERROR;
      } else if (hasRuntimeError) {
        overallStatus = Status.RUNTIME_ERROR;
      } else if (hasTLE) {
        overallStatus = Status.TIME_LIMIT_EXCEEDED;
      } else if (hasSystemError) {
        overallStatus = Status.SYSTEM_ERROR;
      } else {
        overallStatus = Status.WRONG_ANSWER;
      }

      return {
        success: true,
        status: overallStatus,
        results,
        runtime,
        passedCount,
        totalCount,
      };
    } catch (error: any) {
      // This catches unexpected system errors, not execution errors
      return {
        success: false,
        status: Status.SYSTEM_ERROR,
        message: error.message || 'An unexpected error occurred during execution',
        results: [],
        runtime: 0,
        passedCount: 0,
        totalCount: testCases.length,
      };
    }
  }
}
