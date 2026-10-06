import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

/**
 * Azure-backed code execution service using Azure Container Instances (ACI).
 *
 * For scale (3000+ concurrent students), this service routes code to:
 * 1. Microsoft Azure Container Instances - spin up isolated containers per submission
 * 2. Falls back to the local execution engine if Azure is not configured
 *
 * Set these env vars to enable Azure:
 *   AZURE_COMPILER_URL   - URL to your Judge0/Azure ACI endpoint
 *   AZURE_COMPILER_KEY   - API key for the endpoint
 *   AZURE_COMPILER_MODE  - 'judge0' | 'azure_aci' (default: judge0)
 */

// Judge0 language IDs (compatible with hosted Judge0 on Azure)
const JUDGE0_LANG_IDS: Record<string, number> = {
  c: 50,
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
  typescript: 74,
  go: 60,
  rust: 73,
  csharp: 51,
  kotlin: 78,
  swift: 83,
  sql: 82,
};

export interface ExecutionRequest {
  code: string;
  language: string;
  stdin?: string;
  expectedOutput?: string;
  timeoutMs?: number;
  memoryMB?: number;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  status:
    | 'accepted'
    | 'wrong_answer'
    | 'compile_error'
    | 'runtime_error'
    | 'time_limit'
    | 'memory_limit'
    | 'system_error';
  executionTimeMs?: number;
  memoryUsedKB?: number;
  passed?: boolean;
}

@Injectable()
export class AzureExecutionService {
  private readonly logger = new Logger(AzureExecutionService.name);
  private readonly azureUrl: string;
  private readonly azureKey: string;
  private readonly isConfigured: boolean;

  constructor() {
    this.azureUrl = process.env.AZURE_COMPILER_URL || '';
    this.azureKey = process.env.AZURE_COMPILER_KEY || '';
    this.isConfigured = !!(this.azureUrl && this.azureKey);

    if (this.isConfigured) {
      this.logger.log(`Azure Execution Service connected to: ${this.azureUrl}`);
    } else {
      this.logger.warn(
        'Azure Execution Service: No AZURE_COMPILER_URL/KEY set. Will use local executor.',
      );
    }
  }

  get isAvailable(): boolean {
    return this.isConfigured;
  }

  /**
   * Execute a single code submission against one test case via Azure/Judge0.
   */
  async execute(req: ExecutionRequest): Promise<ExecutionResult> {
    if (!this.isConfigured) {
      throw new Error(
        'Azure execution service is not configured. Set AZURE_COMPILER_URL and AZURE_COMPILER_KEY.',
      );
    }

    const langId = JUDGE0_LANG_IDS[req.language?.toLowerCase()];
    if (!langId) {
      return {
        stdout: '',
        stderr: `Unsupported language: ${req.language}`,
        status: 'system_error',
      };
    }

    try {
      // Submit to Judge0-compatible endpoint (Azure-hosted)
      const submitRes = await axios.post(
        `${this.azureUrl}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: req.code,
          language_id: langId,
          stdin: req.stdin || '',
          expected_output: req.expectedOutput || undefined,
          cpu_time_limit: (req.timeoutMs || 5000) / 1000,
          memory_limit: (req.memoryMB || 256) * 1024, // KB
        },
        {
          headers: {
            'X-RapidAPI-Key': this.azureKey,
            'X-RapidAPI-Host': this.extractHost(this.azureUrl),
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      const result = submitRes.data;
      return this.mapJudge0Result(result, req.expectedOutput);
    } catch (err: any) {
      this.logger.error('Azure execution error:', err.message);
      return {
        stdout: '',
        stderr: err.message || 'Execution failed',
        status: 'system_error',
      };
    }
  }

  /**
   * Execute code against multiple test cases (bulk, for assessment scoring).
   * Sends all test cases in parallel for speed.
   */
  async executeWithTestCases(
    code: string,
    language: string,
    testCases: Array<{ id: string | number; input: string; expected: string }>,
    options?: { timeoutMs?: number; memoryMB?: number },
  ): Promise<
    Array<ExecutionResult & { id: string | number; passed: boolean }>
  > {
    const results = await Promise.allSettled(
      testCases.map((tc) =>
        this.execute({
          code,
          language,
          stdin: tc.input,
          expectedOutput: tc.expected,
          ...options,
        }),
      ),
    );

    return results.map((result, idx) => {
      const tc = testCases[idx];
      if (result.status === 'fulfilled') {
        return {
          ...result.value,
          id: tc.id,
          passed: result.value.status === 'accepted',
        };
      }
      return {
        stdout: '',
        stderr: 'Execution failed',
        status: 'system_error' as const,
        id: tc.id,
        passed: false,
      };
    });
  }

  private mapJudge0Result(data: any, expectedOutput?: string): ExecutionResult {
    const statusId = data.status?.id;
    const stdout = (data.stdout || '').trim();
    const stderr = data.stderr || data.compile_output || '';

    let status: ExecutionResult['status'] = 'system_error';
    let passed = false;

    // Judge0 status IDs
    // 1-2: In Queue / Processing (shouldn't happen with wait=true)
    // 3: Accepted
    // 4: Wrong Answer
    // 5: Time Limit Exceeded
    // 6: Compilation Error
    // 7-12: Runtime errors
    // 13: Internal Error
    // 14: Exec Format Error
    if (statusId === 3) {
      status = 'accepted';
      // For open tests without expected output, accepted = passed
      if (!expectedOutput) {
        passed = true;
      } else {
        passed = stdout === expectedOutput.trim();
        status = passed ? 'accepted' : 'wrong_answer';
      }
    } else if (statusId === 4) {
      status = 'wrong_answer';
    } else if (statusId === 5) {
      status = 'time_limit';
    } else if (statusId === 6) {
      status = 'compile_error';
    } else if (statusId >= 7 && statusId <= 12) {
      status = 'runtime_error';
    } else if (statusId === 14) {
      status = 'memory_limit';
    }

    return {
      stdout,
      stderr,
      status,
      passed,
      executionTimeMs: data.time
        ? Math.round(parseFloat(data.time) * 1000)
        : undefined,
      memoryUsedKB: data.memory,
    };
  }

  private extractHost(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  /** Returns the list of supported languages */
  getSupportedLanguages(): string[] {
    return Object.keys(JUDGE0_LANG_IDS);
  }

  /** Returns Judge0 language id for a given language string */
  getLanguageId(language: string): number | null {
    return JUDGE0_LANG_IDS[language?.toLowerCase()] ?? null;
  }
}
