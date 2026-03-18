import { IsString, IsIn } from 'class-validator';

export class UpdateCareerStatusDto {
  @IsString()
  @IsIn(['new', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'])
  status: string;
}
