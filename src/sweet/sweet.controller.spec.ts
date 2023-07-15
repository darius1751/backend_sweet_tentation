import { Test, TestingModule } from '@nestjs/testing';
import { SweetController } from './sweet.controller';
import { SweetService } from './sweet.service';

describe('SweetController', () => {
  let controller: SweetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SweetController],
      providers: [SweetService],
    }).compile();

    controller = module.get<SweetController>(SweetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
