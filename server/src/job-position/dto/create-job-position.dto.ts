import { IsString, IsOptional, IsBoolean, IsInt, MinLength, MaxLength, Min } from 'class-validator';

export class CreateJobPositionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(50)
  type: string;

  @IsString()
  @MaxLength(50)
  mode: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  open?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
