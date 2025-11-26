import { Injectable } from '@nestjs/common';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';

@Injectable()
export class DailyLogService {
  create(createDailyLogDto: CreateDailyLogDto) {
    return 'This action adds a new dailyLog';
  }

  findAll() {
    return `This action returns all dailyLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyLog`;
  }

  update(id: number, updateDailyLogDto: UpdateDailyLogDto) {
    return `This action updates a #${id} dailyLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyLog`;
  }
}
