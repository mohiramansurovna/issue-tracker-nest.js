import { Label } from '@/modules/labels/labels.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateIssueDto {
  @ApiProperty({
    description: 'Updated issue title.',
    example: 'Fix login redirect after OAuth callback',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Updated issue description.',
    example: 'OAuth callback should redirect to /dashboard after success.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Updated issue status.',
    enum: ['todo', 'cancelled'],
    example: 'todo',
  })
  @IsString()
  @IsIn(['todo', 'cancelled'])
  status: string;

  @ApiProperty({
    description: 'Updated issue priority.',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  @IsIn(['low', 'medium', 'high'])
  priority: string;

  @ApiProperty({
    description: 'Updated assignee user id. Use null if not assigned.',
    example: '0f774f3d-6b9a-4c9b-a4c8-4fd07a1546c7',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  assignee_id: string | null;

  @ApiPropertyOptional({
    description: 'Updated list of label references.',
    example: [{ id: 'ad719fdd-e16a-4378-aa46-280e78ce6ad8' }],
    type: 'array',
  })
  @IsOptional()
  @IsArray()
  labels: Label[];
}
