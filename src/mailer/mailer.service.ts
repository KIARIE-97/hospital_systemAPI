import { Injectable } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppMailerService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', //  SMTP provider
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendSimpleMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `"No Reply" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Simple email sent to ${to}`);
  }

  async sendPassresetMail(to: string, username: string) {
    const html = `<h1>Welcome, ${username}!</h1><p>your password is successfully reset.</p>`;
    await this.transporter.sendMail({
      from: `"No Reply" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Welcome!',
      html,
    });
    console.log(`Welcome email sent to ${to}`);
  }
}

//with template
// async sendWelcomeMail(to: string, username: string) {
//   await this.mailerService.sendMail({
//     to,
//     subject: 'Welcome!',
//     template: 'welcome', // path to template file
//     context: { username },
//   });
//   console.log(`Welcome email sent to ${to}`);
// }
