import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(":cmd")
  async getExec(@Param('cmd') cmd: string): Promise<string> {
    return await this.appService.getExec(cmd);    
  }
}
