import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Use Pino as the application logger
  app.useLogger(app.get(Logger));

  // Graceful shutdown — let active requests finish before exiting
  app.enableShutdownHooks();

  // Allow requests from the frontend
  app.enableCors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  app.use(helmet());

  // H5: Global exception filter — safe JSON errors, no stack leaks
  app.useGlobalFilters(new HttpExceptionFilter());

  // Validate all incoming DTOs, strip unknown fields
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // H2: Security headers for uploaded files — prevent stored XSS
  app.use('/uploads', (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    next();
  });

  // Ensure uploads directory exists, serve it statically
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
