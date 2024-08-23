import { Test, TestingModule } from '@nestjs/testing';
import { ReqresApiService } from './reqres-api.service';

describe('ReqresApiService', () => {
  let service: ReqresApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqresApiService],
    }).compile();

    service = module.get<ReqresApiService>(ReqresApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
