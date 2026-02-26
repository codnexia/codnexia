// DTO for updating a content page (all fields optional)
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  content?: string;
}
