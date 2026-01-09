import { Test, TestingModule } from '@nestjs/testing';
import { MasivoService } from './masivo.service';

describe('MasivoService', () => {
  let service: MasivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasivoService],
    }).compile();

    service = module.get<MasivoService>(MasivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
