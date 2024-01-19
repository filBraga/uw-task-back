import { PartialType } from '@nestjs/mapped-types';
import { CreateReservedSeatDto } from './create-reserved-seat.dto';

export class UpdateReservedSeatDto extends PartialType(CreateReservedSeatDto) {}
