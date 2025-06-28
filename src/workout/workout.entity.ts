import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Exercise } from 'src/exercises/exercise.entity';

@Entity('workout')
export class Workout{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    @Index()
    date: Date;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @CreateDateColumn()
    created_at: Date;

    //Trening należy do jednego użytkownika (ManyToOne)
    //Pole user.workouts musi istnieć po stronie User (tablica treningów)
    //onDelete: 'CASCADE' — usunięcie użytkownika usuwa wszystkie jego treningi
    @ManyToOne(() => User, (user) => user.workouts, { onDelete: 'CASCADE' })
    user: User;

    //Trening może mieć wiele ćwiczeń (OneToMany)
    //Zakłada, że w encji Exercise istnieje pole workout: Workout
    //cascade: true – oznacza, że zapisując trening z nowymi 
    // ćwiczeniami, TypeORM zapisze też te ćwiczenia automatycznie
    @OneToMany(() => Exercise, (exercise) => exercise.workout, { cascade: true })
    exercises: Exercise[];
}