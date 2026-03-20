// Extracts text from PDF/DOCX resumes and uses Claude to parse structured data
import { Injectable, Logger } from '@nestjs/common';
import { AiClientService } from './ai-client.service';
import * as mammoth from 'mammoth';

export interface ParsedResume {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  currentRole?: string;
  company?: string;
  experience?: string;
  primaryStack?: string[];
  otherSkills?: string;
  degree?: string;
  field?: string;
  university?: string;
  gradYear?: string;
  summary?: string;
}

@Injectable()
export class ResumeParserService {
  private readonly logger = new Logger(ResumeParserService.name);

  constructor(private readonly aiClient: AiClientService) {}

  async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    if (mimeType === 'application/pdf') {
      // pdf-parse v2 uses a class-based API
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: buffer } as any);
      await (parser as any).load();
      const result = (parser as any).getText();
      return typeof result === 'string' ? result : result?.text ?? '';
    }
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  async parse(buffer: Buffer, mimeType: string): Promise<ParsedResume> {
    const text = await this.extractText(buffer, mimeType);
    if (!text.trim()) {
      this.logger.warn('Resume text extraction returned empty content');
      return {};
    }

    const systemPrompt = `You are a resume parser. Extract structured data from the resume text provided. Return ONLY valid JSON with these fields (omit fields you cannot determine):
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "country": "string",
  "city": "string",
  "linkedin": "string",
  "github": "string",
  "portfolio": "string",
  "currentRole": "string (most recent job title)",
  "company": "string (most recent company)",
  "experience": "string (one of: 'Less than 1 year', '1 - 2 years', '3 - 5 years', '5 - 8 years', '8 - 12 years', '12+ years')",
  "primaryStack": ["array of technology names"],
  "otherSkills": "string (comma-separated non-tech skills)",
  "degree": "string (one of: 'High School / Secondary', 'Diploma / Certificate', 'Associate Degree', 'Bachelor\\'s Degree', 'Master\\'s Degree', 'PhD / Doctorate', 'Bootcamp / Self-taught', 'Other')",
  "field": "string (field of study)",
  "university": "string",
  "gradYear": "string (4-digit year)",
  "summary": "string (1-2 sentence professional summary)"
}

Return ONLY the JSON object, no markdown formatting or explanation.`;

    try {
      const response = await this.aiClient.complete(systemPrompt, text.slice(0, 8000));
      const parsed = JSON.parse(response);
      return parsed as ParsedResume;
    } catch (error) {
      this.logger.error(`Resume parsing failed: ${(error as Error).message}`);
      return {};
    }
  }
}
