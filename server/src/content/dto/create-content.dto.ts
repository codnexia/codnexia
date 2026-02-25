// DTO for creating a new content page
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
