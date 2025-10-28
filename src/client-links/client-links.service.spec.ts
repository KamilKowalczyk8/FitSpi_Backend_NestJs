import { Test, TestingModule } from '@nestjs/testing';
import { ClientLinkService } from './client-links.service';

describe('ClientLinksService', () => {
  let service: ClientLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientLinkService],
    }).compile();

    service = module.get<ClientLinkService>(ClientLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
