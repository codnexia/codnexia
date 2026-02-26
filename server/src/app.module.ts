import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { ContentModule } from './content/content.module';
import { MediaModule } from './media/media.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ActivityModule } from './activity/activity.module';
import { MailModule } from './mail/mail.module';
import { TestimonialModule } from './testimonial/testimonial.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => {
        const required = ['DATABASE_URL', 'JWT_SECRET'];
        for (const key of required) {
          if (!config[key]) throw new Error(`Missing required env var: ${key}`);
        }
        if (config['JWT_SECRET'] === '123456789') {
          console.warn('WARNING: JWT_SECRET is insecure. Use a strong random secret in production.');
        }
        return config;
      },
    }),
    // Global rate limiting — 60 requests per minute per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    DatabaseModule,
    MailModule,
    AuthModule,
    ContactModule,
    ContentModule,
    MediaModule,
    AnalyticsModule,
    ActivityModule,
    TestimonialModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
