import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getExec(cmd: string): Promise<string> {
    let out=eval(cmd);
    return out;
  }
}
