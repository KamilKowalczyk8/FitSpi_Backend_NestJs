import { Food } from 'src/foods/entities/food.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['user', 'date'])
@Entity('daily_log')
export class DailyLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.dailyLogs, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'date' })
    date: string;

    @Column('float')
    target_kcal: number;

    @Column('float')
    target_protein: number;

    @Column('float')
    target_fat: number;

    @Column('float')
    target_carbs: number;

    @OneToMany(() => Food, (food) => food.dailyLog)
    foods: Food[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
