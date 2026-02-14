import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { IssuesService } from '../issues.service';
import { DatabaseService } from '@/modules/database/database.service';

describe('issuesService', () => {
  let service: IssuesService;

  const mockDatabaseService = {
    issue: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
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

  describe('getAll()', () => {
    it('should return issues list', async () => {
      const issues = [
        { id: 'i1', title: 'Issue 1' },
        { id: 'i2', title: 'Issue 2' },
      ];

      mockDatabaseService.issue.findMany.mockResolvedValue(issues);

      const result = await service.getAll();

      expect(mockDatabaseService.issue.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(issues);
    });
  });

  describe('create()', () => {
    const userId = 'creator-1';
    const dto = {
      title: 'Title',
      description: 'Desc',
      status: 'todo',
      priority: 'medium',
      assignee_id: 'assignee-1',
      labels: [],
    };

    it('should create issue with creator and assignee', async () => {
      const result = await service.create(userId, dto as any);

      expect(mockDatabaseService.issue.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          priority: dto.priority,
          creator: {
            connect: { id: userId },
          },
          assignee: {
            connect: { id: dto.assignee_id },
          },
        },
      });
      expect(result).toEqual({ message: 'Created' });
    });

    it('should create issue without assignee and labels', async () => {
      const noAssigneeDto = {
        ...dto,
        assignee_id: null,
        labels: [],
      };

      await service.create(userId, noAssigneeDto as any);

      expect(mockDatabaseService.issue.create).toHaveBeenCalledWith({
        data: {
          title: noAssigneeDto.title,
          description: noAssigneeDto.description,
          status: noAssigneeDto.status,
          priority: noAssigneeDto.priority,
          creator: {
            connect: { id: userId },
          },
        },
      });
    });
  });

  describe('update()', () => {
    const userId = 'creator-1';
    const dto = {
      id: 'issue-1',
      title: 'Title',
      description: 'Desc',
      status: 'todo',
      priority: 'medium',
      assignee_id: 'assignee-1',
      labels: [],
    };

    it('should update issue with assignee and labels', async () => {
      const result = await service.update(userId, dto as any);

      expect(mockDatabaseService.issue.update).toHaveBeenCalledWith({
        where: { id: dto.id },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          priority: dto.priority,
          assignee: {
            connect: { id: dto.assignee_id },
          },
        },
      });
      expect(result).toEqual({ message: 'Updated' });
    });

    it('should update issue without assignee and labels', async () => {
      const noAssigneeDto = {
        ...dto,
        assignee_id: null,
        labels: [],
      };

      await service.update(userId, noAssigneeDto as any);

      expect(mockDatabaseService.issue.update).toHaveBeenCalledWith({
        where: { id: noAssigneeDto.id },
        data: {
          title: noAssigneeDto.title,
          description: noAssigneeDto.description,
          status: noAssigneeDto.status,
          priority: noAssigneeDto.priority,
        },
      });
    });
  });

  describe('deleteIssue()', () => {
    const userId = 'creator-1';
    const dto = { id: 'issue-1' };

    it('should throw if issue is not found', async () => {
      mockDatabaseService.issue.deleteMany.mockResolvedValue({ count: 0 });

      await expect(service.deleteIssue(userId, dto as any)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockDatabaseService.issue.deleteMany).toHaveBeenCalledWith({
        where: { id: dto.id, creator_id: userId },
      });
    });

    it('should delete issue when found', async () => {
      mockDatabaseService.issue.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deleteIssue(userId, dto as any);

      expect(mockDatabaseService.issue.deleteMany).toHaveBeenCalledWith({
        where: { id: dto.id, creator_id: userId },
      });
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
