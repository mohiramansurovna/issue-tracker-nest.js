import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address.',
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (6-22 characters).',
    example: 'Password1!',
    minLength: 6,
    maxLength: 22,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;
}
