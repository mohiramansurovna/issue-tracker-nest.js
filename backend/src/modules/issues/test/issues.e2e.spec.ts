import { Test, TestingModule } from '@nestjs/testing';
import { IssuesController } from '@/modules/issues/issues.controller';
import { IssuesService } from '@/modules/issues/issues.service';

describe('IssuesController (integration)', () => {
  let controller: IssuesController;

  const mockIssuesService = {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteIssue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssuesController],
      providers: [{ provide: IssuesService, useValue: mockIssuesService }],
    }).compile();

    controller = module.get<IssuesController>(IssuesController);
    jest.clearAllMocks();
  });

  it('getAll() delegates query to service', async () => {
    const payload = {
      data: [{ id: 'i1', title: 'Issue 1' }],
      page: 1,
      limit: 8,
      total: 1,
      totalPages: 1,
    };
    mockIssuesService.getAll.mockResolvedValue(payload);

    const query = { page: 1, limit: 8, sortBy: 'created_at', sortDir: 'desc' };
    const result = await controller.getAll(query as any);

    expect(mockIssuesService.getAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(payload);
  });

  it('get() returns issue by id', async () => {
    mockIssuesService.get.mockResolvedValue({ id: 'issue-1', title: 'Issue 1' });

    const result = await controller.get({ id: 'issue-1' });

    expect(mockIssuesService.get).toHaveBeenCalledWith('issue-1');
    expect(result).toEqual({ id: 'issue-1', title: 'Issue 1' });
  });

  it('createIssue() creates issue for current user', async () => {
    mockIssuesService.create.mockResolvedValue({ message: 'Issue created successfully :)' });

    const body = {
      title: 'New issue',
      description: 'Description',
      status: 'todo',
      priority: 'medium',
      assignee_id: null,
      labels: [],
    };

    const result = await controller.createIssue('creator-1', body as any);

    expect(mockIssuesService.create).toHaveBeenCalledWith('creator-1', body);
    expect(result).toEqual({ message: 'Issue created successfully :)' });
  });

  it('updateIssue() updates issue for current user', async () => {
    mockIssuesService.update.mockResolvedValue({ message: 'Issue updated successfully' });

    const body = {
      title: 'Updated title',
      description: 'Updated description',
      status: 'cancelled',
      priority: 'high',
      assignee_id: null,
      labels: [],
    };

    const result = await controller.updateIssue('creator-1', { id: 'issue-1' }, body as any);

    expect(mockIssuesService.update).toHaveBeenCalledWith('creator-1', 'issue-1', body);
    expect(result).toEqual({ message: 'Issue updated successfully' });
  });

  it('deleteIssue() deletes issue for current user', async () => {
    mockIssuesService.deleteIssue.mockResolvedValue({
      message: 'Issue deleted successfully',
    });

    const result = await controller.deleteIssue('creator-1', { id: 'issue-1' });

    expect(mockIssuesService.deleteIssue).toHaveBeenCalledWith('creator-1', 'issue-1');
    expect(result).toEqual({ message: 'Issue deleted successfully' });
  });
});
