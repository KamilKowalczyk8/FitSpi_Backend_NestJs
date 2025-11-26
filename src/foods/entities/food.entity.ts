import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity'
import { Product } from 'src/products/entities/product.entity'; 
import { MealType } from './meal-type.enum';
import { DailyLog } from 'src/daily-log/entities/daily-log.entity';

@Entity('foods_log') 
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  product: Product; 

  @ManyToOne(() => DailyLog, (dailyLog) => dailyLog.foods,{ nullable: false, onDelete: 'CASCADE'})
  dailyLog: DailyLog;

  @Column({ type: 'date' })
  date: Date; 

  @Column({
    type: 'enum',
    enum: MealType,
    default: MealType.Snack,
  })
  meal: MealType; 

  @Column('float')
  grams: number; 

  @Column('float')
  kcal: number;

  @Column('float')
  protein: number;

  @Column('float')
  carbs: number;

  @Column('float')
  fats: number;

  @CreateDateColumn()
  createdAt: Date; 
}