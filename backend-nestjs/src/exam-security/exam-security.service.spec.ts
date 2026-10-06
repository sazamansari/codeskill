import { Test, TestingModule } from '@nestjs/testing';
import { ExamSecurityService } from './exam-security.service';

describe('ExamSecurityService', () => {
  let service: ExamSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamSecurityService],
    }).compile();

    service = module.get<ExamSecurityService>(ExamSecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
