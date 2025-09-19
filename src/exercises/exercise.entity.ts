import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from 'typeorm';
import { User } from 'src/users/user.entity';
import { WeightUnits } from './weight_units.enum';
import { Workout } from 'src/workout/workout.entity';

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

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