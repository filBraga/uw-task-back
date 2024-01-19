import { Test, TestingModule } from '@nestjs/testing';
import { ReservedSeatService } from './reserved-seat.service';

describe('ReservedSeatService', () => {
  let service: ReservedSeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservedSeatService],
    }).compile();

    service = module.get<ReservedSeatService>(ReservedSeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
