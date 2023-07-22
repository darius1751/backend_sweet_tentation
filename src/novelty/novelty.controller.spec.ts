import { Test, TestingModule } from '@nestjs/testing';
import { NoveltyController } from './novelty.controller';
import { NoveltyService } from './novelty.service';

describe('NoveltyController', () => {
  let controller: NoveltyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoveltyController],
      providers: [NoveltyService],
    }).compile();

    controller = module.get<NoveltyController>(NoveltyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
