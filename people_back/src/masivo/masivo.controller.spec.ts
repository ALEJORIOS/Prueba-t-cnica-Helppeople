import { Test, TestingModule } from '@nestjs/testing';
import { MasivoController } from './masivo.controller';

describe('MasivoController', () => {
  let controller: MasivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasivoController],
    }).compile();

    controller = module.get<MasivoController>(MasivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
