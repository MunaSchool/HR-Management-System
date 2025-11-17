import { Test, TestingModule } from '@nestjs/testing';
import { FalsePenaltyController } from './false-penalty.controller';
import { FalsePenaltyService } from './false-penalty.service';

describe('FalsePenaltyController', () => {
  let controller: FalsePenaltyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FalsePenaltyController],
      providers: [FalsePenaltyService],
    }).compile();

    controller = module.get<FalsePenaltyController>(FalsePenaltyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
