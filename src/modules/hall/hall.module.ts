import { Module } from '@nestjs/common';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { Cinema } from '../cinema/entities/cinema.entity';

@Module({
  controllers: [HallController],
  providers: [HallService],
  imports: [
    TypeOrmModule.forFeature([Hall]),
    TypeOrmModule.forFeature([Cinema]),
  ],
})
export class HallModule {}
