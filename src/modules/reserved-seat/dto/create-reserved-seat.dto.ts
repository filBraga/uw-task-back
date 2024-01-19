import { IsNotEmpty } from 'class-validator';

export class CreateReservedSeatDto {
  @IsNotEmpty()
  hallId: number;

  @IsNotEmpty()
  xAxis: number;

  @IsNotEmpty()
  yAxis: number;
}
