import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Workout } from 'src/workout/workout.entity';
import { ExerciseTemplate } from 'src/exercises_template/exercise-template.entity';
import { WeightUnits } from './weight_units.enum';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExerciseTemplate, (template) => template.exercises, { eager: true, nullable: false })
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

  @ManyToOne(() => Workout, (workout) => workout.exercises, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

}
