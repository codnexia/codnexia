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

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendContactNotification(contact: {
    name: string;
    email: string;
    company?: string;
    service?: string;
    budget?: string;
    message: string;
  }) {
    const to = this.config.get('MAIL_TO', 'shadrackbii324@gmail.com');

    // Escape all user input before interpolating into HTML
    const name = escapeHtml(contact.name);
    const email = escapeHtml(contact.email);
    const company = contact.company ? escapeHtml(contact.company) : '';
    const service = contact.service ? escapeHtml(contact.service) : '';
    const budget = contact.budget ? escapeHtml(contact.budget) : '';
    const message = escapeHtml(contact.message);

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a2e; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2DD4A8 0%, #1a9e7a 100%); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #0a0a0a; font-size: 24px; font-weight: 700;">New Contact Submission</h1>
          <p style="margin: 8px 0 0; color: #0a0a0a; opacity: 0.8; font-size: 14px;">Codnexia Contact Form</p>
        </div>

        <div style="padding: 32px 24px;">
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
            ${company ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; vertical-align: top;">Company</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #f0f0f0; font-size: 15px;">${company}</td>
            </tr>` : ''}
            ${service ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; vertical-align: top;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #f0f0f0; font-size: 15px;">${service}</td>
            </tr>` : ''}
            ${budget ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #888; font-size: 13px; vertical-align: top;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a2e; color: #f0f0f0; font-size: 15px;">${budget}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #f0f0f0; font-size: 15px; line-height: 1.6;">${message}</td>
            </tr>
          </table>
        </div>

        <div style="padding: 16px 24px; background: #0d0d0d; text-align: center; border-top: 1px solid #1a1a2e;">
          <p style="margin: 0; color: #555; font-size: 12px;">Codnexia &mdash; Digital Solutions</p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Codnexia" <${this.config.get('SMTP_USER')}>`,
      to,
      subject: `New Contact from ${name} — Codnexia`,
      html,
    });

    this.logger.log(`Contact notification sent for ${name}`);
  }
}
