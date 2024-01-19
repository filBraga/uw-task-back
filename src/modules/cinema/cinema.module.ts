import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';

@Module({
  controllers: [CinemaController],
  providers: [CinemaService],
  imports: [TypeOrmModule.forFeature([Cinema])],
})
export class CinemaModule {}
