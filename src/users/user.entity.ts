import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Exercise } from 'src/exercises/exercise.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from './role.enum';
import { Workout } from 'src/workout/workout.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ length: 100 })
    first_name: string;

    @Column({ length: 100 })
    last_name: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role_id: Role;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    // Hashowanie hasła przed zapisaniem/aktualizacją
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        if(this.password){
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    //Służy do sprawdzenia, czy podane hasło pasuje do 
    // zahashowanego hasła w bazie (np. przy logowaniu).
    async comparePassword(candidatePassword: string): Promise<boolean>{
        return bcrypt.compare(candidatePassword, this.password);
    }

    // // Bezpieczne zwracanie danych użytkownika (bez hasła) do fronta
    safeResponse(){
        const { password, ...userData } = this;
        return userData;
    }
    @OneToMany(() => Workout, (workout) => workout.user)
    workouts: Workout[];

}