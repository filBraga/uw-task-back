import { Module } from '@nestjs/common';
import { ReservedSeatService } from './reserved-seat.service';
import { ReservedSeatController } from './reserved-seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservedSeats } from './entities/reserved-seat.entity';
import { Hall } from '../hall/entities/hall.entity';

@Module({
  controllers: [ReservedSeatController],
  providers: [ReservedSeatService],
  imports: [
    TypeOrmModule.forFeature([ReservedSeats]),
    TypeOrmModule.forFeature([Hall]),
  ],
})
export class ReservedSeatModule {}
