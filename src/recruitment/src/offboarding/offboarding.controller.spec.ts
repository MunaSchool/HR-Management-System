import { Test, TestingModule } from '@nestjs/testing';
import { OffboardingController } from './offboarding.controller';
import { OffboardingService } from './offboarding.service';

describe('OffboardingController', () => {
  let controller: OffboardingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffboardingController],
      providers: [OffboardingService],
    }).compile();

    controller = module.get<OffboardingController>(OffboardingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
