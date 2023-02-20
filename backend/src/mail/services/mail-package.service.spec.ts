import { Test, TestingModule } from '@nestjs/testing';
import { MailPackageService } from './mail.-package.service';

describe('MailPackageService', () => {
  let service: MailPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailPackageService],
    }).compile();

    service = module.get<MailPackageService>(MailPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
