// DTO for updating a content page (all fields optional)
import { IsString, IsOptional } from 'class-validator';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
