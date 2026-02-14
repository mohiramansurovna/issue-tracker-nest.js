import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@/modules/database/database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('postgresql://localhost:5432/testdb'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockConfigService.get).toHaveBeenCalledWith('DATABASE_URL', {
      infer: true,
    });
  });
});
