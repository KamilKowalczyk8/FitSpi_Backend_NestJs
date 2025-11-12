import { User } from "src/users/user.entity";
import { Workout } from "src/workout/workout.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum WorkoutAssignmentStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected'
}

@Entity('workout_assignment')
export class WorkoutAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Workout, (workout) => workout.assignments, { onDelete: 'CASCADE' })
    workout: Workout;

    @ManyToOne(() => User, { onDelete: 'CASCADE'})
    trainee: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    trainer: User;

    @Column({ type: 'date', nullable: true })
    assignedForDate: string;

    @Column({
        type: 'enum',
        enum: WorkoutAssignmentStatus,
        default: WorkoutAssignmentStatus.Pending,
    })
    status: WorkoutAssignmentStatus;

    @CreateDateColumn()
    assignedAt: Date;
}
