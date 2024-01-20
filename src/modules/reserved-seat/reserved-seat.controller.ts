import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReservedSeatService } from './reserved-seat.service';
import { CreateReservedSeatDto } from './dto/create-reserved-seat.dto';
// import { UpdateReservedSeatDto } from './dto/update-reserved-seat.dto';

@Controller('reserved-seat')
export class ReservedSeatController {
  constructor(private readonly reservedSeatService: ReservedSeatService) {}

  @Get('nextAvailableTicket')
  getNextAvailableTicket(
    @Query('hallId') hallId: string,
    @Query('xAxis') xAxis: string,
    @Query('yAxis') yAxis: string,
  ) {
    return this.reservedSeatService.getNextAvailableTicket(
      +hallId,
      +xAxis,
      +yAxis,
    );
  }

  @Post()
  create(@Body() createReservedSeatDto: CreateReservedSeatDto) {
    return this.reservedSeatService.create(createReservedSeatDto);
  }

  @Get()
  findAll() {
    return this.reservedSeatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservedSeatService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReservedSeatDto: UpdateReservedSeatDto,
  // ) {
  //   return this.reservedSeatService.update(+id, updateReservedSeatDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservedSeatService.remove(+id);
  }
}
