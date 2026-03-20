import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RankingsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  position?: string;
}
