import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Food } from './entities/food.entity';
import { DailyLog } from 'src/daily-log/entities/daily-log.entity';
import { UserProfile } from 'src/user-profile/entities/user-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Food,
      Product,
      DailyLog,
      UserProfile,
    ]),
  ],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule {}
