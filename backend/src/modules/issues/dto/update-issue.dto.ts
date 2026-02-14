import { Label } from '@/modules/labels/labels.types';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateIssueDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(['todo', 'cancelled'])
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
