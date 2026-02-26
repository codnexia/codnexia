// DTO for public contact form submissions
import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  budget?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;
}
