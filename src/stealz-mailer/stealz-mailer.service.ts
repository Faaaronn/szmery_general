import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class StealzMailerService {
  private transporter = createTransport({
    //@ts-expect-error wtf
    host: process.env.EMAIL_SERVER_STEALZ,
    port: process.env.EMAIL_PORT_STEALZ,
    auth: {
      user: process.env.EMAIL_LOGIN_STEALZ,
      pass: process.env.EMAIL_PASSWORD_STEALZ,
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

  async sendDebugMessageStealz(
    origin: string,
    errorMessage: string,
  ): Promise<void | { code: string; message: string }> {
    const message = {
      from: {
        name: 'Sneakers Stealz',
        address: process.env.EMAIL_FROM_STEALZ as string,
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

  async sendMessageStealz(
    email: string,
    content: { filename: string; content: Buffer }[],
  ): Promise<void | { code: string; message: string }> {
    const attachments = content.map(
      (file: { filename: string; content: any }) => {
        const attachmentObject = {
          filename: file.filename,
          content: Buffer.from(file.content, 'base64'),
        };
        return attachmentObject;
      },
    );
    const message = {
      from: {
        name: 'Sneakers Stealz',
        address: process.env.EMAIL_FROM_STEALZ as string,
      },
      to: email,
      subject: `Umowa Kupna Sprzedaży Sneakers Stealz`,
      text: `Hej!
        W załączniku znajduje się umowa.
        Dziękuje za transakcję i czekam na kolejną :)
        Pozdrawiam,
        Sneakers Stealz`,
      html: `Hej!
        W załączniku znajduje się umowa.
        Dziękuje za transakcję i czekam na kolejną :)
        Pozdrawiam,
        Sneakers Stealz`,
      attachments: attachments,
    };
    try {
      await this.transporter.sendMail(message);
    } catch (err: unknown) {
      //@ts-expect-error głupi ts
      const { code, message } = err;
      return { code, message };
    }
  }

  async sendMessageToStealz(
    filename: string,
    content: any,
    details: { uid: string; sellerName: string; price: string },
  ): Promise<void | { code: string; message: string }> {
    const { uid, sellerName, price } = details;
    const message = {
      from: {
        name: 'Sneakers Stealz',
        address: process.env.EMAIL_FROM_STEALZ as string,
      },
      to: process.env.TEAM_EMAIL_STEALZ,
      subject: `KS ${uid} - ${sellerName}`,
      text: `Umowa: nr ${uid} 
            Od: ${sellerName}
            Kwota: ${price} PLN`,
      html: `Umowa: nr ${uid} 
            Od: ${sellerName}
            Kwota: ${price} PLN`,
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
}
