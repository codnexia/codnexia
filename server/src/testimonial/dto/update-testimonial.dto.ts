// DTO for updating a testimonial (all fields optional)
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTestimonialDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
