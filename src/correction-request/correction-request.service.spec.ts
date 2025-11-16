import { Test, TestingModule } from '@nestjs/testing';
import { CorrectionRequestService } from './correction-request.service';

describe('CorrectionRequestService', () => {
  let service: CorrectionRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorrectionRequestService],
    }).compile();

    service = module.get<CorrectionRequestService>(CorrectionRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
