import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from '~/configs/database.config';

// const privateKey = process.env.MAIL_DKIM_PRIVATE_KEY || '';

// console.log({
//   mailFromName: process.env.MAIL_FROM_NAME,
//   mailHost: process.env.MAIL_HOST,
//   mailPort: process.env.MAIL_PORT,
//   mailUsername: process.env.MAIL_USERNAME,
//   mailPassword: process.env.MAIL_PASSWORD,
//   url: process.env.FRONTEND_URL,
// });

let transporter = nodemailer.createTransport({
  service: process.env.MAIL_FROM_NAME,
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take messages');
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  const blacklist = await prisma.email_blacklist?.findUnique({
    where: { email: to },
  });
  if (blacklist) {
    throw new Error('Email is blacklisted');
  }

  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to,
    subject,
    html,
    headers: {
      'X-Anti-Spam': 'true',
      'X-Timestamp': new Date().toISOString(),
    },
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const generateResetPasswordEmail = (userId: string, token: string, isAdmin: boolean): EmailOptions => {
  const link = isAdmin
    ? `${process.env.FRONTEND_URL}/admin/reset-password/${userId}/${token}`
    : `${process.env.FRONTEND_URL}/reset-password/${userId}/${token}`;
  return {
    to: '',
    subject: 'Reset Password - Vona',
    html: `
      <p>Hello,</p>
      <p>You have requested to reset your password. Please click the link below to proceed:</p>
      <p><a href="${link}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>
      <p>Best regards,<br/>Vona</p>
      <p style="font-size: 12px; color: #888;">For security, this email includes a unique token: ${token.substring(
        0,
        10
      )}...</p>
    `,
  };
};

const generateTwoFactorEmail = (email: string, code: string): EmailOptions => {
  return {
    to: email,
    subject: 'Your Two-Factor Authentication Code - Vona',
    html: `
      <p>Hello,</p>
      <p>Your two-factor authentication code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please contact support immediately.</p>
      <p>Best regards,<br/>Vona</p>
    `,
  };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY || 'secret');
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export { generateResetPasswordEmail, generateTwoFactorEmail, sendEmail };
