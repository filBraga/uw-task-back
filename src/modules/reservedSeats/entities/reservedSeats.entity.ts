import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hall } from '../../hall/entities/hall.entity';

@Entity('cinema')
export class ResearvedSeats {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Hall, (hall) => hall.researvedSeats)
  @JoinColumn({ name: 'hallId' })
  hall: Hall;
}
