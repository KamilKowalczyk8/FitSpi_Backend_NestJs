import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Gender } from './gender.enum';
import { ActivityLevel } from './activity-level.enum';
import { DietGoal } from './goal.enum';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn() 
  user: User;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'date' })
  date_of_birth: string; 

  @Column('float')
  height_cm: number; 

  @Column('float')
  weight_kg: number; 

 
  @Column({ 
    type: 'enum', 
    enum: ActivityLevel, 
    default: ActivityLevel.SEDENTARY 
  })
  activity_level: ActivityLevel;

  @Column({ 
    type: 'enum', 
    enum: DietGoal, 
    default: DietGoal.MAINTAIN 
  })
  goal: DietGoal;

  
  @Column('int', { nullable: true })
  calculated_bmr: number; 

  @Column('int', { nullable: true })
  calculated_kcal: number; 

  @Column('int', { nullable: true })
  calculated_protein: number; 

  @Column('int', { nullable: true })
  calculated_fat: number; 

  @Column('int', { nullable: true })
  calculated_carbs: number; 

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}