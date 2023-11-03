import { User } from '@prisma/client';

class BrevoClient {
  private TRANSACTIONAL_URL = 'https://api.brevo.com/v3/smtp/email';

  constructor(private apiKey: string) {}

  async sendMail(receiver: User, subject: string, content: string) {
    const emailData = {
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
      subject,
      htmlcontent: content,
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-key': this.apiKey,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(emailData),
    };

    try {
      const response = await fetch(this.TRANSACTIONAL_URL, requestOptions);
      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Email sending error: ${error}`);
    }
  }
}

export default new BrevoClient(process.env.BREVO_API_KEY as string);
