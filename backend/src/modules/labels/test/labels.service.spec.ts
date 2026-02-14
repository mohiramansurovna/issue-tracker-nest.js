import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LabelsService } from '@/modules/labels/labels.service';
import { DatabaseService } from '@/modules/database/database.service';

describe('LabelsService', () => {
  let service: LabelsService;

  const mockDatabaseService = {
    label: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    issue: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabelsService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<LabelsService>(LabelsService);
    jest.clearAllMocks();
  });

  it('getAll() returns labels list', async () => {
    const labels = [{ id: 'l-1', title: 'bug', color: '#ef4444' }];
    mockDatabaseService.label.findMany.mockResolvedValue(labels);

    const result = await service.getAll();

    expect(mockDatabaseService.label.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(labels);
  });

  it('create() creates label and returns success message', async () => {
    const dto = { title: 'feature', color: '#22c55e' };

    const result = await service.create(dto);

    expect(mockDatabaseService.label.create).toHaveBeenCalledWith({
      data: dto,
    });
    expect(result).toEqual({ message: 'Created' });
  });

  it('delete() throws when label is still used by issues', async () => {
    mockDatabaseService.issue.count.mockResolvedValue(2);

    await expect(service.delete('label-1')).rejects.toThrow(BadRequestException);

    expect(mockDatabaseService.issue.count).toHaveBeenCalledWith({
      where: {
        labels: {
          some: {
            id: 'label-1',
          },
        },
      },
    });
    expect(mockDatabaseService.label.delete).not.toHaveBeenCalled();
  });

  it('delete() deletes unused label and returns success message', async () => {
    mockDatabaseService.issue.count.mockResolvedValue(0);

    const result = await service.delete('label-2');

    expect(mockDatabaseService.label.delete).toHaveBeenCalledWith({
      where: {
        id: 'label-2',
      },
    });
    expect(result).toEqual({ message: 'Deleted' });
  });
});
