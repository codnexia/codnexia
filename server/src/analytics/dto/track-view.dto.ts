// DTO for tracking a page view from the client site
import { IsString, IsOptional, Matches, MaxLength, MinLength } from 'class-validator';

export class TrackViewDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9/_\-.#?&=%]+$/, { message: 'Invalid page path' })
  page: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Invalid session ID format' })
  sessionId: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9 _-]+$/, { message: 'Invalid device identifier' })
  device?: string;
}
