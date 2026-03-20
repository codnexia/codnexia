// Validation for resume upload
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ParseResumeDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  fileName?: string;
}
