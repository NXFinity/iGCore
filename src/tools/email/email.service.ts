import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { join } from 'path';
import { UsersService } from 'src/api/users/users.service';
import { Verification } from './templates/verification';
import { User } from 'src/api/users/entities/user.entity';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private usersService: UsersService,
    private verificationEmailService: Verification,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Error configuring transporter: ' + error.message);
      } else {
        this.logger.log('Transporter configured successfully');
      }
    });
  }

  async sendVerificationEmail(user: User) {
    const verificationToken = this.generateVerificationToken();

    // Save the verification token to the user entity
    user.verifyToken = verificationToken;
    await this.usersService.usersRepository.save(user);

    const url = `${process.env.SERVER_DOMAIN}/verify?token=${verificationToken}`;

    // Use the VerificationEmailService to get the email HTML
    const emailHtml =
      this.verificationEmailService.getVerificationEmailTemplate(
        user,
        url,
        verificationToken,
      );

    const iconPath = join(__dirname, 'assets', 'icon.png'); // Ensure the path is correct

    const mailOptions = {
      from: '"BEAMIFY ME" <' + process.env.SMTP_USERNAME + '>',
      to: user.email,
      subject: 'Verify your account on BEAMIFY ME',
      html: emailHtml, // Use the rendered HTML as the email content
      attachments: [
        {
          filename: 'icon.png',
          path: iconPath,
          cid: 'beamifyLogo', // same cid value as in the html img src
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.warn(
        `Failed to send verification email to ${user.email}: ${error.message}`,
      );
      // Handle the error appropriately, e.g., notify the user, retry, etc.
    }
  }

  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async sendForgotPasswordEmail(
    email: string,
    token: Promise<{ accessToken: string }>,
  ) {
    const url = `${process.env.SERVER_DOMAIN}/reset-password?token=${token}`;

    const mailOptions = {
      from: '"BEAMIFY ME" <' + process.env.SMTP_USERNAME + '>',
      to: email,
      subject: 'Reset Password',
      html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
    };
    return this.transporter.sendMail(mailOptions);
  }
}
