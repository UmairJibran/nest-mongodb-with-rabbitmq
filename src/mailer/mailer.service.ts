import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  async sendMail(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Mocking Email sent to ' + email + '...');
    return;
  }
}
