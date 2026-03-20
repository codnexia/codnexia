// DTO for updating a content page (all fields optional)
import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Draft', 'Published'])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  content?: string;
}
