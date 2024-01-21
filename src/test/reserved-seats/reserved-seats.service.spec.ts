import { Repository } from 'typeorm';
import { Hall } from '../../modules/hall/entities/hall.entity';
import { ReservedSeats } from '../../modules/reserved-seat/entities/reserved-seat.entity';
import { ReservedSeatService } from '../../modules/reserved-seat/reserved-seat.service';
describe('ReservedSeatService', () => {
  let reservedSeatService: ReservedSeatService;
  let reservedSeatsRepository: Repository<ReservedSeats>;
  let hallRepository: Repository<Hall>;

  beforeEach(() => {
    reservedSeatsRepository = new Repository<ReservedSeats>(null, null);
    hallRepository = new Repository<Hall>(null, null);

    reservedSeatService = new ReservedSeatService(
      reservedSeatsRepository,
      hallRepository,
    );
  });

  const findOneMock = {
    id: 1,
    xAxis: 10,
    yAxis: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const findMock = [
    {
      id: 14,
      xAxis: 1,
      yAxis: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 15,
      xAxis: 2,
      yAxis: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 17,
      xAxis: 5,
      yAxis: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      jest
        .spyOn(hallRepository, 'findOne')
        .mockImplementation(async () => findOneMock as any);

      jest
        .spyOn(reservedSeatsRepository, 'find')
        .mockImplementation(async () => findMock as any);

      jest.spyOn(reservedSeatService, 'getNextAvailableTicket'); // tive que adicionar essa aqui

      const result = await reservedSeatService.getNextAvailableTicket(1, 1, 1);

      expect(result).toEqual({
        isGoingToCenter: true,
        position: {
          x: 2,
          y: 3,
        },
      });

      expect(reservedSeatService.getNextAvailableTicket).toHaveBeenCalledTimes(
        1,
      );

      expect(hallRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
