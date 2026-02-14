import { Label } from '@/modules/labels/labels.types';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(['todo', 'in-progress', 'done', 'cancelled'])
  status: string;

  @IsIn(['low', 'medium', 'high'])
  priority: string;

  @IsOptional()
  @IsString()
  assignee_id: string | null;

  @IsOptional()
  @IsArray()
  labels: Label[];
}
