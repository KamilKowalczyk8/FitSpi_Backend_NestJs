import { Test, TestingModule } from '@nestjs/testing';
import { DailyLogController } from './daily-log.controller';
import { DailyLogService } from './daily-log.service';

describe('DailyLogController', () => {
  let controller: DailyLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyLogController],
      providers: [DailyLogService],
    }).compile();

    controller = module.get<DailyLogController>(DailyLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
