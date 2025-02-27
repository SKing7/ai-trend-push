import { Controller, Get } from '@nestjs/common';
import { fireCrawlTask } from './tasks/crontab';

@Controller()
export class AppController {
  constructor() {}

  @Get('/api/gen')
  async ai() {
    const result = await fireCrawlTask();
    return {
      status: 0,
      data: result,
    };
  }
}
