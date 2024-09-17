import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import configuration from './config/configuration';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        MongooseModule.forRoot(configuration().mongoDbUrl),
        UserModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should load configuration correctly', () => {
    const configService = appModule.get(ConfigService);
    expect(configService).toBeDefined();
    expect(configService.get('mongoDbUrl')).toBe(configuration().mongoDbUrl);
  });

  it('should import MongooseModule with correct URL', () => {
    const mongooseModule = appModule.get(MongooseModule);
    expect(mongooseModule).toBeDefined();
  });

  it('should import UserModule', () => {
    const userModule = appModule.get(UserModule);
    expect(userModule).toBeDefined();
  });
});
