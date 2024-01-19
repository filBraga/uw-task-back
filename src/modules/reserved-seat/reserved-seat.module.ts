import { Module } from '@nestjs/common';
import { ReservedSeatService } from './reserved-seat.service';
import { ReservedSeatController } from './reserved-seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservedSeats } from './entities/reserved-seat.entity';

@Module({
  controllers: [ReservedSeatController],
  providers: [ReservedSeatService],
  imports: [TypeOrmModule.forFeature([ReservedSeats])],
})
export class ReservedSeatModule {}
