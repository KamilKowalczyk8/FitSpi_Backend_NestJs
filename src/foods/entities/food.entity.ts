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

@Entity('foods_log') 
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.foodLogs, { nullable: false })
  user: User;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  product: Product; 

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