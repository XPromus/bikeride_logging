import { Test, TestingModule } from '@nestjs/testing';
import { GpxController } from './gpx.controller';

describe('GpxController', () => {
  let controller: GpxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GpxController],
    }).compile();

    controller = module.get<GpxController>(GpxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
