// DTO for creating a new content page
import { IsString, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @IsIn(['Draft', 'Published'])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  content?: string;
}
