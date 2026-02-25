// DTO for tracking a page view from the client site
import { IsString, IsOptional } from 'class-validator';

export class TrackViewDto {
  @IsString()
  page: string;

  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  device?: string;
}
