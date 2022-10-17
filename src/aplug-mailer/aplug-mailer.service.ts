import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class AplugMailerService {
  private transporter = createTransport({
    //@ts-expect-error wtf
    host: process.env.EMAIL_SERVER_APLUG,
    port: process.env.EMAIL_PORT_APLUG,
    auth: {
      user: process.env.EMAIL_LOGIN_APLUG,
      pass: process.env.EMAIL_PASSWORD_APLUG,
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

  async sendMessageAplug(
    email: string,
    filename: string,
    content: any,
  ): Promise<void | { code: string; message: string }> {
    const message = {
      from: {
        name: 'APLUG sp. z o.o.',
        address: process.env.EMAIL_FROM_APLUG as string,
      },
      to: email,
      subject: `Umowa Kupna Sprzedaży z APLUG SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ`,
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

  async sendMessageToAplug(
    filename: string,
    content: any,
  ): Promise<void | { code: string; message: string }> {
    const message = {
      from: {
        name: 'APLUG sp. z o.o.',
        address: process.env.EMAIL_FROM_APLUG as string,
      },
      to: process.env.TEAM_EMAIL_APLUG,
      subject: `Umowa Kupna Sprzedaży z APLUG SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ ${new Date()
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .slice(0, -8)}`,
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
  async sendDebugMessageAplug(
    origin: string,
    errorMessage: string,
  ): Promise<void | { code: string; message: string }> {
    const message = {
      from: {
        name: 'APLUG sp. z o.o.',
        address: process.env.EMAIL_FROM_APLUG as string,
      },
      to: process.env.DEBUG_EMAIL,
      subject: `Błąd wysyłania plików z funkcji ${origin}`,
      text: '',
      html: `${errorMessage}`,
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
