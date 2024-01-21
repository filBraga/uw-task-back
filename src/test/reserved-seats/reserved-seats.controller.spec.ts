import { ReservedSeatController } from '../../modules/reserved-seat/reserved-seat.controller';
import { ReservedSeatService } from '../../modules/reserved-seat/reserved-seat.service';

describe('ReservedSeatController', () => {
  let reservedSeatController: ReservedSeatController;
  let reservedSeatService: ReservedSeatService;

  beforeEach(() => {
    reservedSeatService = new ReservedSeatService(null, null);
    reservedSeatController = new ReservedSeatController(reservedSeatService);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = [
        {
          id: 14,
          xAxis: 1,
          yAxis: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      jest
        .spyOn(reservedSeatService, 'getNextAvailableTicket')
        .mockImplementation(async () => result as any);

      await reservedSeatController.getNextAvailableTicket('1', '1', '1');

      expect(reservedSeatService.getNextAvailableTicket).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
