import { Module } from '@nestjs/common';
import { DailyLogService } from './daily-log.service';
import { DailyLogController } from './daily-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyLog } from './entities/daily-log.entity';
import { User } from 'src/users/user.entity';
import { Food } from 'src/foods/entities/food.entity';

@Module({
   imports: [TypeOrmModule.forFeature([
      DailyLog,
      User,
      Food
    ]),
  ],
  controllers: [DailyLogController],
  providers: [DailyLogService],
  exports: [DailyLogService],
})
export class DailyLogModule {}
