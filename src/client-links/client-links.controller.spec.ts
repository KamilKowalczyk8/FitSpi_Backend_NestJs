import { Test, TestingModule } from '@nestjs/testing';
import { ClientLinksController } from './client-links.controller';
import { ClientLinksService } from './client-links.service';

describe('ClientLinksController', () => {
  let controller: ClientLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientLinksController],
      providers: [ClientLinksService],
    }).compile();

    controller = module.get<ClientLinksController>(ClientLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
