import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { IssuesService } from '../issues.service';
import { DatabaseService } from '@/modules/database/database.service';

describe('IssuesService', () => {
  let service: IssuesService;

  const mockDatabaseService = {
    $transaction: jest.fn(),
    issue: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuesService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<IssuesService>(IssuesService);
    jest.clearAllMocks();
  });

  it('getAll() returns paginated payload from transaction', async () => {
    const data = [{ id: 'i1', title: 'Issue 1' }];
    mockDatabaseService.$transaction.mockResolvedValue([1, data]);

    const result = await service.getAll({
      page: 1,
      limit: 8,
      term: '',
      sortBy: 'created_at',
      sortDir: 'desc',
    });

    expect(mockDatabaseService.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      data,
      page: 1,
      limit: 8,
      total: 1,
      totalPages: 1,
    });
  });

  it('get() returns issue by id with relations', async () => {
    const issue = { id: 'issue-1', title: 'Issue 1' };
    mockDatabaseService.issue.findUnique.mockResolvedValue(issue);

    const result = await service.get('issue-1');

    expect(mockDatabaseService.issue.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'issue-1' },
      }),
    );
    expect(result).toEqual(issue);
  });

  it('create() creates issue with creator, assignee and labels', async () => {
    const dto = {
      title: 'Title',
      description: 'Desc',
      status: 'todo',
      priority: 'medium',
      assignee_id: 'assignee-1',
      labels: [{ id: 'label-1' }],
    };

    const result = await service.create('creator-1', dto as any);

    expect(mockDatabaseService.issue.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        creator: {
          connect: { id: 'creator-1' },
        },
        assignee: {
          connect: { id: dto.assignee_id },
        },
        labels: {
          connect: [{ id: 'label-1' }],
        },
      },
    });
    expect(result).toEqual({ message: 'Issue created successfully :)' });
  });

  it('update() updates issue scoped to creator', async () => {
    const dto = {
      title: 'Updated',
      description: 'Updated desc',
      status: 'cancelled',
      priority: 'high',
      assignee_id: 'assignee-2',
      labels: [{ id: 'label-2' }],
    };

    const result = await service.update('creator-1', 'issue-1', dto as any);

    expect(mockDatabaseService.issue.update).toHaveBeenCalledWith({
      where: { id: 'issue-1', creator_id: 'creator-1' },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        assignee: {
          connect: { id: dto.assignee_id },
        },
        labels: {
          set: [{ id: 'label-2' }],
        },
      },
    });
    expect(result).toEqual({ message: 'Issue updated successfully' });
  });

  it('deleteIssue() throws when issue does not exist for creator', async () => {
    mockDatabaseService.issue.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.deleteIssue('creator-1', 'issue-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deleteIssue() deletes issue when found', async () => {
    mockDatabaseService.issue.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.deleteIssue('creator-1', 'issue-1');

    expect(result).toEqual({ message: 'Issue deleted successfully' });
  });
});
