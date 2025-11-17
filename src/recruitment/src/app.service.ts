import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'HR Recruitment Subsystem API is running!';
  }
}
