import { Test, TestingModule } from '@nestjs/testing';
import { ExamSecurityController } from './exam-security.controller';

describe('ExamSecurityController', () => {
  let controller: ExamSecurityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSecurityController],
    }).compile();

    controller = module.get<ExamSecurityController>(ExamSecurityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
