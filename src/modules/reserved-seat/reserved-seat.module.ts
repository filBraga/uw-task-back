import { Module } from '@nestjs/common';
import { ReservedSeatService } from './reserved-seat.service';
import { ReservedSeatController } from './reserved-seat.controller';

@Module({
  controllers: [ReservedSeatController],
  providers: [ReservedSeatService],
})
export class ReservedSeatModule {}
