import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLabelDto {
  @ApiProperty({
    description: 'Label name.',
    example: 'bug',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Label color in hex format.',
    example: '#ef4444',
    nullable: true,
  })
  @IsString()
  color: string | null;
}
