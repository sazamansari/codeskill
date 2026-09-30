import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus() {
    return {
      status: 'ok',
      service: 'CodeSkill API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      docs: '/api/docs',
    };
  }
}
