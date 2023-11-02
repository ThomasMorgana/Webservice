import { User } from '@prisma/client';
import brevoClient from '../clients/brevo.client';
import { welcomeUser } from '../assets/templates/mail/welcome.template';

class MailService {
  async onRegister(user: User) {
    const content = welcomeUser(user);
    const subject = 'Welcome !';
    brevoClient.sendMail(user, subject, content);
  }
}

export default new MailService();
