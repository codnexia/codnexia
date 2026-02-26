import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),
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
  providers: [AppService],
})
export class AppModule {}
