import { User } from '@prisma/client';

class BrevoClient {
  TRANSACTIONAL_URL = 'https://api.brevo.com/v3/smtp/email';

  async sendMail(receiver: User, subject: string, content: string) {
    const data = {
      sender: {
        name: 'Webservice',
        email: 'no-reply@webservice.com',
      },
      to: [
        {
          name: receiver.email,
          email: receiver.email,
        },
      ],
      subject: subject,
      htmlcontent: content,
    };

    await fetch(this.TRANSACTIONAL_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY ?? '',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    });
  }
}

export default new BrevoClient();
