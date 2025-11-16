import { Test, TestingModule } from '@nestjs/testing';
import { CorrectionRequestController } from './correction-request.controller';
import { CorrectionRequestService } from './correction-request.service';

describe('CorrectionRequestController', () => {
  let controller: CorrectionRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorrectionRequestController],
      providers: [CorrectionRequestService],
    }).compile();

    controller = module.get<CorrectionRequestController>(CorrectionRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
