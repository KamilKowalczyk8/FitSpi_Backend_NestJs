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
  @JoinColumn() // Ta kolumna fizycznie będzie w tabeli user_profiles jako `userId`
  user: User;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'date' })
  date_of_birth: string; // Na podstawie tego obliczysz wiek

  @Column('float')
  height_cm: number; // Wzrost w cm

  @Column('float')
  weight_kg: number; // Aktualna waga

  // Typ pracy i aktywność fizyczna w jednym (współczynnik PAL)
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

  // Opcjonalnie: automatycznie wyliczone zapotrzebowanie (cache)
  // Możesz to liczyć w locie, albo zapisać tutaj, żeby nie liczyć przy każdym zapytaniu
  @Column('int', { nullable: true })
  calculated_bmr: number; // Podstawowa przemiana (ile palisz leżąc)

  @Column('int', { nullable: true })
  calculated_tdee: number; // Całkowita przemiana (ile jeść wg celu)

  @Column('int', { nullable: true })
  calculated_protein: number; // Gramy

  @Column('int', { nullable: true })
  calculated_fat: number; // Gramy

  @Column('int', { nullable: true })
  calculated_carbs: number; // Gramy

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}