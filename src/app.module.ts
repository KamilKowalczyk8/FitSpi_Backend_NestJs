import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExerciseModule } from './exercises/exercise.module';
import { WorkoutModule } from './workout/workout.module';
import { AuthModule } from './auth/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ExerciseTemplateModule } from './exercises_template/exercise-template.module';
import { FoodsModule } from './foods/foods.module';
import { ProductsModule } from './products/products.module';
import { ClientLinksModule } from './client-links/client-links.module';
import { WorkoutAssignmentsModule } from './workout-assignments/workout-assignments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    PrometheusModule.register(),
    AuthModule,
    ExerciseModule,
    WorkoutModule,
    ExerciseTemplateModule,
    FoodsModule,
    ProductsModule,
    ClientLinksModule,
    WorkoutAssignmentsModule,
    
  ],
})
export class AppModule {}
