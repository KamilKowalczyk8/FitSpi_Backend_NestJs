import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { LinkStatus } from './link-status.enum';

@Entity('client_links')
@Unique(['trainerId', 'clientId']) // Zapobiega duplikatom relacji
export class ClientLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trainerId: number;

  @Column()
  clientId: number;

  @ManyToOne(() => User, (user) => user.clientsAsTrainer)
  @JoinColumn({ name: 'trainerId' })
  trainer: User;

  @ManyToOne(() => User, (user) => user.linksAsClient)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({
    type: 'enum',
    enum: LinkStatus,
    default: LinkStatus.Pending,
  })
  status: LinkStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}