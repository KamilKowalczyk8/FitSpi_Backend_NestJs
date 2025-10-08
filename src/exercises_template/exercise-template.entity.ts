import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ExerciseTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; 
}
