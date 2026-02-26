// DTO for tracking a page view from the client site
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class TrackViewDto {
  @IsString()
  @MaxLength(255)
  page: string;

  @IsString()
  @MaxLength(100)
  sessionId: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  device?: string;
}
