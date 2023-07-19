import { Test, TestingModule } from '@nestjs/testing';
import { AdditionController } from './addition.controller';
import { AdditionService } from './addition.service';

describe('AdditionController', () => {
  let controller: AdditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdditionController],
      providers: [AdditionService],
    }).compile();

    controller = module.get<AdditionController>(AdditionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
