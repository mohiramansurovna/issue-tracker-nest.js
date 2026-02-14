import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { GetIussesParamsDto } from './dto/get-issues.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class IssuesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll(query: GetIussesParamsDto) {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Number(query.limit || 8));
    const term = (query.term ?? '').trim();

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.IssueWhereInput = term
      ? {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        }
      : {};

    const sortable = new Set([
      'created_at',
      'updated_at',
      'priority',
      'status',
    ]);

    const sortyBy = sortable.has(query.sortBy ?? '')
      ? query.sortBy!
      : 'created_at';
    const sortDir = query.sortDir === 'asc' ? 'asc' : 'desc';

    const orderBy: Prisma.IssueOrderByWithRelationInput = {
      [sortyBy]: sortDir,
    };

    const [total, data] = await this.databaseService.$transaction([
      this.databaseService.issue.count({ where }),
      this.databaseService.issue.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          labels: true,
          creator: { select: { id: true, email: true } },
          assignee: { select: { id: true, email: true } },
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { data, page, limit, total, totalPages };
  }

  async get(id: string) {
    return await this.databaseService.issue.findUnique({
      where: {id},
      include: {
        labels: true,
        creator: { select: { id: true, email: true } },
        assignee: { select: { id: true, email: true } },
      },
    });
  }

  async create(userId: string, dto: CreateIssueDto) {
    const { assignee_id, labels = [], ...rest } = dto;
    await this.databaseService.issue.create({
      data: {
        ...rest,
        creator: {
          connect: { id: userId },
        },
        ...(assignee_id
          ? {
              assignee: {
                connect: { id: assignee_id },
              },
            }
          : {}),
        ...(labels.length
          ? {
              labels: {
                connect: labels.map((l) => ({ id: l.id })),
              },
            }
          : {}),
      },
    });

    return { message: 'Issue created successfully :)' };
  }

  async update(userId: string, id: string, dto: UpdateIssueDto) {
    const { assignee_id, labels, ...rest } = dto;
    await this.databaseService.issue.update({
      where: { id, creator_id: userId },
      data: {
        ...rest,
        ...(assignee_id
          ? {
              assignee: {
                connect: { id: assignee_id },
              },
            }
          : {}),
        ...(labels.length
          ? {
              labels: {
                set: labels.map((l) => ({ id: l.id })),
              },
            }
          : {}),
      },
    });
    return { message: 'Issue updated successfully' };
  }

  async deleteIssue(userId: string, id: string) {
    const result = await this.databaseService.issue.deleteMany({
      where: {
        id,
        creator_id: userId,
      },
    });

    if (result.count == 0) throw new NotFoundException('Issue not found');

    return { message: 'Issue deleted successfully' };
  }
}
