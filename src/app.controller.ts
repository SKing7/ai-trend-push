import { Controller, Get } from '@nestjs/common';
import { WeixinWorkflow } from './workflows/weixin-article.workflow';

@Controller()
export class AppController {
  constructor() {}

  @Get('/api/gen')
  async ai() {
    const result = await new WeixinWorkflow().process();
    return {
      status: 0,
      data: result,
    };
  }
}
