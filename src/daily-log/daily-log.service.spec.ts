import { Test, TestingModule } from '@nestjs/testing';
import { DailyLogService } from './daily-log.service';

describe('DailyLogService', () => {
  let service: DailyLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyLogService],
    }).compile();

    service = module.get<DailyLogService>(DailyLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
