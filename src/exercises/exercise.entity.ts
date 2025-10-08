import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Workout } from 'src/workout/workout.entity';
import { ExerciseTemplate } from 'src/exercises_template/exercise-template.entity';
import { WeightUnits } from './weight_units.enum';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExerciseTemplate, { eager: true, nullable: false })
  template: ExerciseTemplate; 

  @Column()
  sets: number;

  @Column()
  reps: number;

  @Column('float')
  weight: number;

  @Column({
    type: 'enum',
    enum: WeightUnits,
  })
  weightUnits: WeightUnits;

  @Column()
  day: string;

  @ManyToOne(() => Workout, (workout) => workout.exercises, { onDelete: 'CASCADE' })
  workoutId: Workout;
}
