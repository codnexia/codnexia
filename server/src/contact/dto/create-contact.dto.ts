// DTO for public contact form submissions
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsString()
  @MinLength(10)
  message: string;
}
