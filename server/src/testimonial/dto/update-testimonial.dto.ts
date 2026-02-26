// DTO for updating a testimonial (all fields optional)
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateTestimonialDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  author?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
