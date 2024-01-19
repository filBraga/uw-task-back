import { Test, TestingModule } from '@nestjs/testing';
import { ReservedSeatController } from './reserved-seat.controller';
import { ReservedSeatService } from './reserved-seat.service';

describe('ReservedSeatController', () => {
  let controller: ReservedSeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservedSeatController],
      providers: [ReservedSeatService],
    }).compile();

    controller = module.get<ReservedSeatController>(ReservedSeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
