import { Injectable } from '@nestjs/common';
import { CreateReservedSeatDto } from './dto/create-reserved-seat.dto';
import { UpdateReservedSeatDto } from './dto/update-reserved-seat.dto';
import { ReservedSeats } from './entities/reserved-seat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReservedSeatService {
  constructor(
    @InjectRepository(ReservedSeats)
    private reservedSeatsRepository: Repository<ReservedSeats>,
  ) {}

  create(createReservedSeatDto: CreateReservedSeatDto) {
    try {
      const reservedSeatCreated = this.reservedSeatsRepository.create(
        createReservedSeatDto,
      );
      return this.reservedSeatsRepository.save(reservedSeatCreated);
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all reservedSeat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservedSeat`;
  }

  update(id: number, updateReservedSeatDto: UpdateReservedSeatDto) {
    return `This action updates a #${id} reservedSeat`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservedSeat`;
  }
}
