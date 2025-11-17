import { Test, TestingModule } from '@nestjs/testing';
import { FalsePenaltyService } from './false-penalty.service';

describe('FalsePenaltyService', () => {
  let service: FalsePenaltyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FalsePenaltyService],
    }).compile();

    service = module.get<FalsePenaltyService>(FalsePenaltyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
