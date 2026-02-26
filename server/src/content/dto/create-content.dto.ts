// DTO for creating a new content page
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  content?: string;
}
