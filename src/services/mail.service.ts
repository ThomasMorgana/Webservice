import { User } from '@prisma/client';
import brevoClient from '../clients/brevo.client';
import { welcomeUser } from '../assets/templates/mail/welcome.template';
import { resetPassword } from '../assets/templates/mail/reset-password.template';

class MailService {
  async onRegister(user: User) {
    const { subject, content } = welcomeUser(user);
    brevoClient.sendMail(user, subject, content);
  }

  async onPasswordReset(user: User, token: string) {
    const { subject, content } = resetPassword(user, token);
    brevoClient.sendMail(user, subject, content);
  }
}

export default new MailService();
