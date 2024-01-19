import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hall } from '../../hall/entities/hall.entity';

@Entity()
export class ReservedSeats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  xAxis: number;

  @Column()
  yAxis: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Hall, (hall) => hall.ReservedSeats)
  @JoinColumn({ name: 'hallId' })
  hall: Hall;
}
