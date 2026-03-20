// Wrapper around the Anthropic Claude API
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);
  private client: Anthropic;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      this.logger.warn('ANTHROPIC_API_KEY not set — AI features will fail at runtime');
    }
    this.client = new Anthropic({ apiKey: apiKey || 'missing' });
  }

  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock?.text ?? '';
    } catch (error) {
      this.logger.error(`Claude API call failed: ${(error as Error).message}`);
      throw error;
    }
  }
}
