import { IsNotEmpty } from 'class-validator';

type Cinema = {
  id: number;
};

export class CreateHallDto {
  @IsNotEmpty()
  xAxis: number;

  @IsNotEmpty()
  yAxis: number;

  @IsNotEmpty()
  cinema: Cinema;
}
