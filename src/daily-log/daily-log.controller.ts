import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyLogService } from './daily-log.service';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';

@Controller('daily-log')
export class DailyLogController {
  constructor(private readonly dailyLogService: DailyLogService) {}

  @Post()
  create(@Body() createDailyLogDto: CreateDailyLogDto) {
    return this.dailyLogService.create(createDailyLogDto);
  }

  @Get()
  findAll() {
    return this.dailyLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyLogDto: UpdateDailyLogDto) {
    return this.dailyLogService.update(+id, updateDailyLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyLogService.remove(+id);
  }
}
