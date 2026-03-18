import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
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
import { PortfolioModule } from './portfolio/portfolio.module';
import { HealthModule } from './health/health.module';
import { CareerModule } from './career/career.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => {
        const isProd = config['NODE_ENV'] === 'production';
        const required = ['DATABASE_URL', 'JWT_SECRET'];
        for (const key of required) {
          if (!config[key]) throw new Error(`Missing required env var: ${key}`);
        }

        // C1: Enforce strong JWT secret
        const jwtSecret = String(config['JWT_SECRET']);
        const weakSecrets = ['123456789', 'secret', 'password', 'changeme', 'jwt_secret'];
        if (weakSecrets.includes(jwtSecret) || jwtSecret.length < 32) {
          if (isProd) {
            throw new Error('JWT_SECRET must be at least 32 characters and not a common value in production');
          }
          console.warn('WARNING: JWT_SECRET is weak. Use a strong random secret (32+ chars) in production.');
        }

        // C2: Validate SMTP, CLIENT_URL & MAIL_TO in production
        const prodRequired = ['SMTP_USER', 'SMTP_PASS', 'CLIENT_URL', 'MAIL_TO'];
        for (const key of prodRequired) {
          if (!config[key]) {
            if (isProd) throw new Error(`Missing required env var for production: ${key}`);
            console.warn(`WARNING: ${key} is not set. Required in production.`);
          }
        }

        return config;
      },
    }),
    // Structured logging with Pino
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        autoLogging: { ignore: (req) => (req as { url?: string }).url === '/api/health' },
      },
    }),
    // Rate limiting — global default + named throttlers for sensitive endpoints
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 60 },
      { name: 'strict', ttl: 60000, limit: 5 },
    ]),
    DatabaseModule,
    MailModule,
    AuthModule,
    ContactModule,
    ContentModule,
    MediaModule,
    AnalyticsModule,
    ActivityModule,
    TestimonialModule,
    PortfolioModule,
    HealthModule,
    CareerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
