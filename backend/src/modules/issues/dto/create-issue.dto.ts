import { Label } from '@/modules/labels/labels.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateIssueDto {
  @ApiProperty({
    description: 'Short issue title.',
    example: 'Fix login redirect',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed issue description.',
    example: 'After login, user should be redirected to /dashboard.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Current issue status.',
    enum: ['todo', 'cancelled'],
    example: 'todo',
  })
  @IsString()
  @IsIn(['todo', 'in-progress', 'done', 'cancelled'])
  status: string;

  @ApiProperty({
    description: 'Issue priority.',
    enum: ['low', 'medium', 'high'],
    example: 'high',
  })
  @IsIn(['low', 'medium', 'high'])
  priority: string;

  @ApiProperty({
    description: 'Assignee user id. Use null if not assigned.',
    example: '0f774f3d-6b9a-4c9b-a4c8-4fd07a1546c7',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  assignee_id: string | null;

  @ApiPropertyOptional({
    description: 'List of label references to attach to the issue.',
    example: [{ id: 'ad719fdd-e16a-4378-aa46-280e78ce6ad8' }],
    type: 'array',
  })
  @IsOptional()
  @IsArray()
  labels: Label[];
}
