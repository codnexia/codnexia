// DTO for creating a new testimonial
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(2)
  author: string;

  @IsString()
  @MinLength(2)
  company: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
