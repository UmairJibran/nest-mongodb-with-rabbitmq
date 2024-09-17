import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import faker from 'faker';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('MailerService', () => {
    let service: MailerService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [MailerService],
      }).compile();

      service = module.get<MailerService>(MailerService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should send mail', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const email = faker.internet.email();

      await service.sendMail(email);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Mocking Email sent to ' + email + '...',
      );
      consoleSpy.mockRestore();
    });
  });
});
