import { Exercise } from 'src/exercises/exercise.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ExerciseTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; 

  @OneToMany(() => Exercise, (exercise) => exercise.template)
  exercises: Exercise[];
}
