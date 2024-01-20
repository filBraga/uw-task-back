import { Injectable } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
// import { UpdateHallDto } from './dto/update-hall.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hall } from './entities/hall.entity';
import { Cinema } from '../cinema/entities/cinema.entity';

@Injectable()
export class HallService {
  constructor(
    @InjectRepository(Hall)
    private hallRepository: Repository<Hall>,

    @InjectRepository(Cinema)
    private cinemaRepository: Repository<Cinema>,
  ) {}

  async create(createHallDto: CreateHallDto) {
    const hallCreated = this.hallRepository.create(createHallDto);
    return this.hallRepository.save(hallCreated);
  }

  findAll() {
    return this.hallRepository.find();
  }

  findOne(id: number) {
    return this.hallRepository.findOne({ where: { id } });
  }

  // update(id: number, updateHallDto: UpdateHallDto) {
  //   return `This action updates a #${id} hall`;
  // }

  remove(id: number) {
    return `This action removes a #${id} hall`;
  }
}
