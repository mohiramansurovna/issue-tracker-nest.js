import { IsString } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  title: string;

  @IsString()
  color: string | null;
}
