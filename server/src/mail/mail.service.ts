import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

// Escape HTML special characters to prevent XSS in email templates
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function emailWrapper(title: string, subtitle: string, body: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a2e; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #2DD4A8 0%, #1a9e7a 100%); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: #0a0a0a; font-size: 24px; font-weight: 700;">${escapeHtml(title)}</h1>
        <p style="margin: 8px 0 0; color: #0a0a0a; opacity: 0.8; font-size: 14px;">${escapeHtml(subtitle)}</p>
      </div>
      <div style="padding: 32px 24px;">${body}</div>
      <div style="padding: 16px 24px; background: #0d0d0d; text-align: center; border-top: 1px solid #1a1a2e;">
        <p style="margin: 0; color: #555; font-size: 12px;">Codnexia &mdash; Digital Solutions</p>
      </div>
    </div>
  `;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  private async send(to: string, subject: string, html: string) {
    const smtpUser = this.config.get('SMTP_USER');
    if (!smtpUser) {
      this.logger.warn(`SMTP not configured — skipping email to ${to}: ${subject}`);
      return;
    }
    await this.transporter.sendMail({
      from: `"Codnexia" <${smtpUser}>`,
      to,
      subject,
      html,
    });
    this.logger.log(`Email sent to ${to}: ${subject}`);
  }

  async sendContactNotification(contact: {
    name: string;
    email: string;
    company?: string;
    service?: string;
    budget?: string;
    message: string;
  }) {
    const to = this.config.getOrThrow<string>('MAIL_TO');
    const name = escapeHtml(contact.name);
    const email = escapeHtml(contact.email);
    const company = contact.company ? escapeHtml(contact.company) : '';
    const service = contact.service ? escapeHtml(contact.service) : '';
    const budget = contact.budget ? escapeHtml(contact.budget) : '';
    const message = escapeHtml(contact.message);

    const html = emailWrapper('New Contact Submission', 'Codnexia Contact Form', `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; width: 100px; vertical-align: top;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #f0f0f0; font-size: 15px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; vertical-align: top;">Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #2DD4A8; font-size: 15px;">
            <a href="mailto:${email}" style="color: #2DD4A8; text-decoration: none;">${email}</a>
          </td>
        </tr>
        ${company ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; vertical-align: top;">Company</td><td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #f0f0f0; font-size: 15px;">${company}</td></tr>` : ''}
        ${service ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; vertical-align: top;">Service</td><td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #f0f0f0; font-size: 15px;">${service}</td></tr>` : ''}
        ${budget ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; vertical-align: top;">Budget</td><td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #f0f0f0; font-size: 15px;">${budget}</td></tr>` : ''}
        <tr>
          <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">Message</td>
          <td style="padding: 12px 0; color: #f0f0f0; font-size: 15px; line-height: 1.6;">${message}</td>
        </tr>
      </table>
    `);

    await this.send(to, `New Contact from ${name} — Codnexia`, html);
  }

  // ── Career / Recruitment Emails ──

  async sendApplicationReceived(to: string, name: string, position: string) {
    const html = emailWrapper('Application Received', 'Codnexia Careers', `
      <p style="color: #f0f0f0; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        Hi <strong>${escapeHtml(name)}</strong>,
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        Thank you for applying for the <strong style="color: #2DD4A8;">${escapeHtml(position)}</strong> position at Codnexia.
        We've received your application and our AI screening system is reviewing it now.
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        You'll hear from us soon with next steps. If you're shortlisted, you'll receive an invitation
        to complete an AI-powered interview at your convenience.
      </p>
      <p style="color: #888; font-size: 13px; margin: 0;">Best regards,<br/>The Codnexia Team</p>
    `);
    await this.send(to, `Application Received — ${escapeHtml(position)} — Codnexia`, html);
  }

  async sendAdminNewApplication(candidateName: string, position: string, score?: number) {
    const adminEmail = this.config.get<string>('MAIL_TO');
    if (!adminEmail) return;

    const scoreText = score !== undefined ? `<br/><strong style="color: #2DD4A8;">AI Screening Score: ${score}/100</strong>` : '';
    const html = emailWrapper('New Application', 'Codnexia Careers Admin', `
      <p style="color: #f0f0f0; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        A new application has been submitted:
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        <strong>Candidate:</strong> ${escapeHtml(candidateName)}<br/>
        <strong>Position:</strong> ${escapeHtml(position)}${scoreText}
      </p>
      <p style="color: #888; font-size: 13px; margin: 0;">Review in the admin dashboard.</p>
    `);
    await this.send(adminEmail, `New Application: ${escapeHtml(candidateName)} for ${escapeHtml(position)}`, html);
  }

  async sendInterviewInvitation(to: string, name: string, position: string, interviewUrl: string, expiresAt: Date) {
    const expiry = expiresAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const html = emailWrapper('AI Interview Invitation', 'Codnexia Careers', `
      <p style="color: #f0f0f0; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        Hi <strong>${escapeHtml(name)}</strong>,
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        Great news! You've been shortlisted for the <strong style="color: #2DD4A8;">${escapeHtml(position)}</strong> position.
        We'd like you to complete an AI-powered interview.
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        The interview consists of 8 questions covering technical skills, problem-solving, and your experience.
        You can complete it at your own pace — take your time to give thoughtful answers.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${escapeHtml(interviewUrl)}" style="display: inline-block; background: linear-gradient(135deg, #2DD4A8, #1a9e7a); color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700;">
          Start Interview
        </a>
      </div>
      <p style="color: #888; font-size: 13px; margin: 0 0 8px;">
        This link expires on <strong style="color: #ccc;">${expiry}</strong>.
      </p>
      <p style="color: #888; font-size: 13px; margin: 0;">Best of luck!<br/>The Codnexia Team</p>
    `);
    await this.send(to, `AI Interview Invitation — ${escapeHtml(position)} — Codnexia`, html);
  }

  async sendInterviewCompleted(to: string, name: string) {
    const html = emailWrapper('Interview Completed', 'Codnexia Careers', `
      <p style="color: #f0f0f0; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        Hi <strong>${escapeHtml(name)}</strong>,
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        Thank you for completing the AI interview! Our team is now reviewing your responses.
        We'll be in touch soon with the results.
      </p>
      <p style="color: #888; font-size: 13px; margin: 0;">Best regards,<br/>The Codnexia Team</p>
    `);
    await this.send(to, 'Interview Completed — Codnexia', html);
  }

  async sendStatusUpdate(to: string, name: string, status: string, position: string) {
    const statusMessages: Record<string, string> = {
      reviewed: 'Your application is being reviewed by our team.',
      shortlisted: 'Congratulations! You have been shortlisted. You will receive further instructions soon.',
      interviewed: 'Your interview has been scheduled. Check your email for the interview link.',
      rejected: 'After careful consideration, we have decided to move forward with other candidates. Thank you for your interest.',
      hired: 'Congratulations! We are delighted to offer you the position. Our team will be in touch with the details.',
    };

    const message = statusMessages[status] || `Your application status has been updated to: ${status}`;
    const html = emailWrapper('Application Update', 'Codnexia Careers', `
      <p style="color: #f0f0f0; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        Hi <strong>${escapeHtml(name)}</strong>,
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        Regarding your application for <strong style="color: #2DD4A8;">${escapeHtml(position)}</strong>:
      </p>
      <p style="color: #f0f0f0; font-size: 14px; line-height: 1.7; margin: 0 0 16px; padding: 16px; background: #111; border-radius: 8px; border-left: 3px solid #2DD4A8;">
        ${escapeHtml(message)}
      </p>
      <p style="color: #888; font-size: 13px; margin: 0;">Best regards,<br/>The Codnexia Team</p>
    `);
    await this.send(to, `Application Update — ${escapeHtml(position)} — Codnexia`, html);
  }

  async sendHighScoreAlert(candidateName: string, position: string, score: number) {
    const adminEmail = this.config.get<string>('MAIL_TO');
    if (!adminEmail) return;

    const html = emailWrapper('High-Score Candidate', 'Codnexia Careers Admin', `
      <p style="color: #f0f0f0; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        A candidate has achieved a high composite score:
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        <strong>Candidate:</strong> ${escapeHtml(candidateName)}<br/>
        <strong>Position:</strong> ${escapeHtml(position)}<br/>
        <strong style="color: #2DD4A8; font-size: 18px;">Score: ${score}/100</strong>
      </p>
      <p style="color: #888; font-size: 13px; margin: 0;">Review in the admin dashboard.</p>
    `);
    await this.send(adminEmail, `High-Score Candidate: ${escapeHtml(candidateName)} (${score}/100)`, html);
  }

  async sendInterviewReminder(to: string, name: string, url: string, expiresAt: Date) {
    const expiry = expiresAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const html = emailWrapper('Interview Reminder', 'Codnexia Careers', `
      <p style="color: #f0f0f0; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        Hi <strong>${escapeHtml(name)}</strong>,
      </p>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
        Just a reminder that your AI interview link expires on <strong style="color: #f0f0f0;">${expiry}</strong>.
        Please complete it before then.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${escapeHtml(url)}" style="display: inline-block; background: linear-gradient(135deg, #2DD4A8, #1a9e7a); color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700;">
          Continue Interview
        </a>
      </div>
      <p style="color: #888; font-size: 13px; margin: 0;">Best regards,<br/>The Codnexia Team</p>
    `);
    await this.send(to, 'Interview Reminder — Codnexia', html);
  }
}
