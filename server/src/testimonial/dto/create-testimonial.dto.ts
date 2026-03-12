// DTO for creating a new testimonial
import { IsString, IsOptional, IsBoolean, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  author: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  company: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  role?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
