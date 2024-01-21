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
    return this.reservedSeatsRepository.find();
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

  async getNextAvailableTicket(hallId, xAxis = undefined, yAxis = undefined) {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } });

    console.log('xAxis');
    console.log(xAxis);

    xAxis = xAxis ? xAxis : Math.floor(hall.xAxis / 2);
    yAxis = yAxis ? yAxis : Math.floor(hall.yAxis / 2);

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
      position: { x: xAxis, y: yAxis }, // adicionei o PARSE INT
      isGoingToCenter: true,
    });

    while (positionsQueue.length) {
      const positionChecked = positionsQueue.shift();

      console.log('positionChecked');
      console.log(positionChecked);

      if (positionChecked.position.x > hall.xAxis) continue;
      if (positionChecked.position.y > hall.yAxis) continue;

      if (positionChecked.position.x < 0) continue;
      if (positionChecked.position.y < 0) continue;

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

  async findAllByHall(hallId) {
    const hall = await this.hallRepository.findOne({ where: { id: hallId } });

    const reservedSeats = await this.reservedSeatsRepository
      .createQueryBuilder('reservedSeat')
      .leftJoinAndSelect('reservedSeat.hall', 'hall')
      .where('hall.id = :hallId', { hallId })
      .getMany();

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

    return arrayOfArray;
  }
}
