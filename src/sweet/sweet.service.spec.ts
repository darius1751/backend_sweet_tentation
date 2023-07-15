import { Test, TestingModule } from '@nestjs/testing';
import { SweetService } from './sweet.service';

describe('SweetService', () => {
  let service: SweetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SweetService],
    }).compile();

    service = module.get<SweetService>(SweetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
