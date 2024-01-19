import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cinema } from '../../cinema/entities/cinema.entity';
import { ReservedSeats } from '../../reserved-seat/entities/reserved-seat.entity';

@Entity('hall')
export class Hall {
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

  @ManyToOne(() => Cinema, (cinema) => cinema.halls)
  @JoinColumn({ name: 'cinemaId' })
  cinema: Cinema;

  @OneToMany(() => ReservedSeats, (ReservedSeats) => ReservedSeats.hall)
  @JoinColumn({ name: 'hallId' })
  ReservedSeats: ReservedSeats[];
}
