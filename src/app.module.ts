import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExerciseModule } from './exercises/exercise.module';
import { WorkoutModule } from './workout/workout.module';
import { AuthModule } from './auth/auth.module';
import { ExerciseTemplateModule } from './exercises_template/exercise-template.module';
import { FoodsModule } from './foods/foods.module';
import { ProductsModule } from './products/products.module';
import { ClientLinksModule } from './client-links/client-links.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DailyLogModule } from './daily-log/daily-log.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, 
      },
      autoLoadEntities: true,
      logging: ['query', 'error'],
      logger: 'advanced-console',
    }),
    AuthModule,
    ExerciseModule,
    WorkoutModule,
    ExerciseTemplateModule,
    FoodsModule,
    ProductsModule,
    ClientLinksModule,
    DailyLogModule,
    UserProfileModule,
  
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],

})
export class AppModule {}
