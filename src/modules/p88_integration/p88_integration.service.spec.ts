import { Test, TestingModule } from '@nestjs/testing';
import { P88IntegrationService } from './p88_integration.service';

describe('P88IntegrationService', () => {
  let service: P88IntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [P88IntegrationService],
    }).compile();

    service = module.get<P88IntegrationService>(P88IntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
