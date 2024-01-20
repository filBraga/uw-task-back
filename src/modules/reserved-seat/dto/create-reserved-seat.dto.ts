import { IsNotEmpty, Min } from 'class-validator';

type Hall = {
  id: number;
};

export class CreateReservedSeatDto {
  @IsNotEmpty()
  hall: Hall;

  @IsNotEmpty()
  @Min(0)
  xAxis: number;

  @IsNotEmpty()
  @Min(0)
  yAxis: number;
}
