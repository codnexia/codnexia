// DTO for public career application submissions
import { IsEmail, IsString, IsOptional, IsArray, MinLength, MaxLength } from 'class-validator';

export class CreateCareerApplicationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  lastName: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCode?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  country: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nationality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  linkedin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  github?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  portfolio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  currentRole: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  company?: string;

  @IsString()
  @MaxLength(100)
  experience: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  noticePeriod?: string;

  @IsString()
  @MaxLength(50)
  employmentType: string;

  @IsString()
  @MaxLength(50)
  workMode: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salaryExpectation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  salaryCurrency?: string;

  @IsArray()
  @IsString({ each: true })
  primaryStack: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  otherSkills?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  proficiency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  languages?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  certifications?: string;

  @IsString()
  @MaxLength(255)
  degree: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  field?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  university?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  gradYear?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  position: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  coverLetter: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  heardFrom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  availability?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  callDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  callTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  callTopics?: string[];
}
