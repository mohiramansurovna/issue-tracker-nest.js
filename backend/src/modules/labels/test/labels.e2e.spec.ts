import { Test, TestingModule } from '@nestjs/testing';
import { LabelsController } from '@/modules/labels/labels.controller';
import { LabelsService } from '@/modules/labels/labels.service';

describe('LabelsController (integration)', () => {
  let controller: LabelsController;

  const mockLabelsService = {
    getAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabelsController],
      providers: [{ provide: LabelsService, useValue: mockLabelsService }],
    }).compile();

    controller = module.get<LabelsController>(LabelsController);
    jest.clearAllMocks();
  });

  it('getAll() returns labels', async () => {
    mockLabelsService.getAll.mockResolvedValue([
      { id: 'l-1', title: 'bug', color: '#ef4444' },
    ]);

    const result = await controller.getAll();

    expect(result).toEqual([{ id: 'l-1', title: 'bug', color: '#ef4444' }]);
  });

  it('create() creates label', async () => {
    const body = { title: 'feature', color: '#22c55e' };
    mockLabelsService.create.mockResolvedValue({ message: 'Created' });

    const result = await controller.create(body);

    expect(mockLabelsService.create).toHaveBeenCalledWith(body);
    expect(result).toEqual({ message: 'Created' });
  });

  it('deleteLabel() deletes label', async () => {
    mockLabelsService.delete.mockResolvedValue({ message: 'Deleted' });

    const result = await controller.deleteLabel('label-1');

    expect(mockLabelsService.delete).toHaveBeenCalledWith('label-1');
    expect(result).toEqual({ message: 'Deleted' });
  });
});
