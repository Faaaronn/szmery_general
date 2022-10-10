import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = createTransport({
    //@ts-expect-error wtf
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });
  async transporterVerification() {
    this.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }

  async sendMessage(
    email: string,
    filename: string,
    content: any,
  ): Promise<void | { code: string; message: string }> {
    const message = {
      from: {
        name: 'APLUG sp. z o.o.',
        address: process.env.EMAIL_FROM as string,
      },
      to: email,
      subject:
        'Umowa Kupna Sprzedaży z APLUG SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
      text: '',
      html: '',
      attachments: [
        {
          filename: filename,
          // content: content,
          content: Buffer.from(content, 'base64'),
        },
      ],
    };
    try {
      await this.transporter.sendMail(message);
    } catch (err: unknown) {
      //@ts-expect-error głupi ts
      const { code, message } = err;
      return { code, message };
    }
  }

  async sendPlainEmail(
    email: string,
  ): Promise<void | { code: string; message: string }> {
    const message = {
      from: {
        name: 'APLUG sp. z o.o.',
        address: process.env.EMAIL_FROM as string,
      },
      to: email,
      subject:
        'Umowa Kupna Sprzedaży z APLUG SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
      text: '',
      html: 'ffff',
    };
    try {
      await this.transporter.sendMail(message);
    } catch (err: unknown) {
      //@ts-expect-error głupi ts
      const { code, message } = err;
      return { code, message };
    }
  }
}
