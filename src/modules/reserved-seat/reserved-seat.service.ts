import { Injectable } from '@nestjs/common';
import { CreateReservedSeatDto } from './dto/create-reserved-seat.dto';
// import { UpdateReservedSeatDto } from './dto/update-reserved-seat.dto';
import { ReservedSeats } from './entities/reserved-seat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Hall } from '../hall/entities/hall.entity';
import {
  addOneToFurthestAxis,
  checkIfSeatEmpty,
  checkIfSeatOnCentral,
} from '../../utils';
import { positionChecked } from '../types';

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

  // update(id: number, updateReservedSeatDto: UpdateReservedSeatDto) {
  //   return `This action updates a #${id} reservedSeat`;
  // }

  remove(id: number) {
    return `This action removes a #${id} reservedSeat`;
  }

  async getNextAvailableTicket1(hallId, xAxis, yAxis) {
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
      return { xAxis, yAxis };
    }

    const centralPoint = [Math.ceil(hall.xAxis / 2), Math.ceil(hall.yAxis / 2)];

    const xDirection = xAxis > centralPoint[0] ? -1 : 1;
    const yDirection = yAxis > centralPoint[1] ? -1 : 1;

    for (let i = 0; true; i++) {
      const newX = xAxis + i * xDirection; // 2 = 1 + 1 * 1
      const newY = yAxis + i * yDirection; // 2 = 1 + 1 * 1

      if (checkIfSeatEmpty(arrayOfArray, newX, newY)) {
        return {
          xAxis: newX,
          yAxis: newY,
        };
      }

      if (checkIfSeatEmpty(arrayOfArray, newX + xDirection, newY)) {
        return {
          xAxis: newX + xDirection,
          yAxis: newY,
        };
      }

      if (checkIfSeatEmpty(arrayOfArray, newX, newY + yDirection)) {
        return {
          xAxis: newX,
          yAxis: newY + yDirection,
        };
      }
    }
  }

  async getNextAvailableTicket(hallId, xAxis, yAxis) {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } });

    xAxis = xAxis !== null ? xAxis : Math.floor(hall.xAxis / 2);
    yAxis = yAxis !== null ? yAxis : Math.floor(hall.yAxis / 2);

    const reservedSeats = await this.reservedSeatsRepository.find({
      where: { hall: hallId },
    });

    const hallSeats = [];

    for (let i = 0; i < hall.xAxis; i++) {
      hallSeats.push([]);
      for (let j = 0; j < hall.yAxis; j++) {
        hallSeats[i].push(0);
      }
    }

    reservedSeats.forEach((reservedSeat) => {
      hallSeats[reservedSeat.xAxis][reservedSeat.yAxis] = 1;
      hallSeats[reservedSeat.xAxis][reservedSeat.yAxis + 1] = 1;
      hallSeats[reservedSeat.xAxis + 1][reservedSeat.yAxis] = 1;
      hallSeats[reservedSeat.xAxis][reservedSeat.yAxis - 1] = 1;
      hallSeats[reservedSeat.xAxis - 1][reservedSeat.yAxis] = 1;
    });

    const centralPoint = {
      x:
        xAxis > hall.xAxis / 2
          ? Math.ceil(hall.xAxis / 2)
          : Math.floor(hall.xAxis / 2),
      y:
        yAxis > hall.yAxis / 2
          ? Math.ceil(hall.yAxis / 2)
          : Math.floor(hall.yAxis / 2),
    };

    const positionsQueue: positionChecked[] = [];

    positionsQueue.push({
      position: { x: xAxis, y: yAxis },
      isGoingToCenter: true,
    });

    while (positionsQueue.length) {
      const positionChecked = positionsQueue.shift();
      if (
        checkIfSeatEmpty(
          hallSeats,
          positionChecked.position.x,
          positionChecked.position.y,
        )
      )
        return positionChecked;

      if (checkIfSeatOnCentral(centralPoint, positionChecked)) break;

      const nextDirection = addOneToFurthestAxis(centralPoint, positionChecked);

      if (positionChecked.isGoingToCenter) {
        positionsQueue.push({
          position: {
            x: positionChecked.position.x + nextDirection.x,
            y: positionChecked.position.y + nextDirection.y,
          },
          isGoingToCenter: true,
        });
      }
    }

    const positionsQueueCentral: positionChecked[] = [];

    positionsQueueCentral.push({
      position: {
        x: centralPoint.x,
        y: centralPoint.y,
      },
      isGoingToCenter: false,
    });

    const checkedSeats = {};
    const getSeatKey = ({ x, y }) => 'x:' + x + 'y:' + y;

    while (true) {
      const positionChecked = positionsQueueCentral.shift();

      if (positionChecked.position.x > hall.xAxis) continue;
      if (positionChecked.position.y > hall.yAxis) continue;

      if (positionChecked.position.x < 0) continue;
      if (positionChecked.position.y < 0) continue;

      if (checkedSeats[getSeatKey(positionChecked.position)]) continue;
      checkedSeats[getSeatKey(positionChecked.position)] = true;

      if (
        checkIfSeatEmpty(
          hallSeats,
          positionChecked.position.x,
          positionChecked.position.y,
        )
      ) {
        return positionChecked;
      }

      positionsQueueCentral.push(
        {
          position: {
            x: positionChecked.position.x + 1,
            y: positionChecked.position.y,
          },
        },
        {
          position: {
            x: positionChecked.position.x,
            y: positionChecked.position.y + 1,
          },
        },
        {
          position: {
            x: positionChecked.position.x - 1,
            y: positionChecked.position.y,
          },
        },
        {
          position: {
            x: positionChecked.position.x,
            y: positionChecked.position.y - 1,
          },
        },
      );
    }
  }
}
