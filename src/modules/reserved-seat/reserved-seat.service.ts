import { Injectable } from '@nestjs/common';
import { CreateReservedSeatDto } from './dto/create-reserved-seat.dto';
import { UpdateReservedSeatDto } from './dto/update-reserved-seat.dto';
import { ReservedSeats } from './entities/reserved-seat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Hall } from '../hall/entities/hall.entity';

@Injectable()
export class ReservedSeatService {
  constructor(
    @InjectRepository(ReservedSeats)
    private reservedSeatsRepository: Repository<ReservedSeats>,

    @InjectRepository(Hall)
    private hallRepository: Repository<Hall>,
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

  async getNextAvailableTicket(hallId, xAxis, yAxis) {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } });

    if (!hall) {
      return 'Hall not found';
    }

    if (xAxis > hall.xAxis || yAxis > hall.yAxis) {
      return 'Seat out of bound';
    }

    const reservedSeats = await this.reservedSeatsRepository.find({
      where: { hall: hallId },
    });

    const arrayOfArray = [];

    for (let i = 0; i < hall.xAxis; i++) {
      arrayOfArray.push([]);
      for (let j = 0; j < hall.yAxis; j++) {
        arrayOfArray[i].push(0);
      }
    }

    reservedSeats.forEach((reservedSeat) => {
      arrayOfArray[reservedSeat.xAxis][reservedSeat.yAxis] = 1;
      arrayOfArray[reservedSeat.xAxis][reservedSeat.yAxis + 1] = 1;
      arrayOfArray[reservedSeat.xAxis + 1][reservedSeat.yAxis] = 1;
      arrayOfArray[reservedSeat.xAxis][reservedSeat.yAxis - 1] = 1;
      arrayOfArray[reservedSeat.xAxis - 1][reservedSeat.yAxis] = 1;
    });

    if (arrayOfArray[xAxis][yAxis] === 0) {
      return { availableSeat: { xAxis, yAxis } };
    }

    const centralPoint = [Math.ceil(hall.xAxis / 2), Math.ceil(hall.yAxis / 2)];

    const xDirection = xAxis > centralPoint[0] ? -1 : 1;
    const yDirection = yAxis > centralPoint[1] ? -1 : 1;

    for (let i = 0; true; i++) {
      const checkSeatPositionBaseX = xAxis + i * xDirection; // 2 = 1 + 1 * 1
      const checkSeatPositionBaseY = yAxis + i * yDirection; // 2 = 1 + 1 * 1

      // check the base line
      if (
        arrayOfArray[checkSeatPositionBaseX][checkSeatPositionBaseY] === 0 // [2][2] === 0  false
      ) {
        return {
          availableSeat: {
            xAxis: checkSeatPositionBaseX,
            yAxis: checkSeatPositionBaseY,
          },
        };
      }

      // check + 1 in the x
      if (
        arrayOfArray[checkSeatPositionBaseX + xDirection][
          checkSeatPositionBaseY
        ] === 0 // [3][2] === 0  true
      ) {
        console.log('hereeeee');

        return {
          availableSeat: {
            xAxis: checkSeatPositionBaseX + xDirection,
            yAxis: checkSeatPositionBaseY,
          },
        };
      }

      // check + 1 in the y
      if (
        arrayOfArray[checkSeatPositionBaseX][
          checkSeatPositionBaseY + yDirection
        ] === 0
      ) {
        return {
          availableSeat: {
            xAxis: checkSeatPositionBaseX,
            yAxis: checkSeatPositionBaseY + yDirection,
          },
        };
      }

      // if (
      //   arrayOfArray[checkSeatPositionBaseX - xDirection][
      //     checkSeatPositionBaseY
      //   ] === 0
      // ) {
      //   return {
      //     availableSeat: {
      //       xAxis: checkSeatPositionBaseX - xDirection,
      //       yAxis: checkSeatPositionBaseY,
      //     },
      //   };
      // }

      // if (
      //   arrayOfArray[checkSeatPositionBaseX][
      //     checkSeatPositionBaseY - yDirection
      //   ] === 0
      // ) {
      //   return {
      //     availableSeat: {
      //       xAxis: checkSeatPositionBaseX,
      //       yAxis: checkSeatPositionBaseY - yDirection,
      //     },
      //   };
      // }
    }
  }
}
