import { User } from '@prisma/client';
import brevoClient from '../clients/brevo.client';

export type MailDTO = {
  sender: {
    name: string;
    email: string;
  };
  to: [
    {
      name: string;
      email: string;
    },
  ];
  subject: string;
  htmlcontent: string;
};

class MailService {
  async onRegister(user: User) {
    const data: MailDTO = {
      sender: {
        name: 'Webservice',
        email: 'webserice@no-reply.com',
      },
      to: [
        {
          name: user.email,
          email: user.email,
        },
      ],
      subject: 'Bienvenue !',
      htmlcontent:
        '<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"',
    };

    brevoClient.sendMail(data);
  }
}

export default new MailService();
