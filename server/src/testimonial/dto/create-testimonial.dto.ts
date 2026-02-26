// DTO for creating a new testimonial
import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  author: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  company: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
