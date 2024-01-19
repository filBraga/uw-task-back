import { IsNotEmpty } from 'class-validator';

type Hall = {
  id: number;
};

export class CreateReservedSeatDto {
  @IsNotEmpty()
  hall: Hall;

  @IsNotEmpty()
  xAxis: number;

  @IsNotEmpty()
  yAxis: number;
}
