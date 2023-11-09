import { User } from '@prisma/client';
import mailClient from '../clients/brevo.client';
import { welcomeUser, resetPassword } from '../assets/templates/mail';
import { InternalServerError } from '../errors/base.error';

class MailService {
  async onRegister(user: User, activationCode: string) {
    const { subject, content } = welcomeUser(user, activationCode);
    try {
      await mailClient.sendMail(user, subject, content);
    } catch (error) {
      throw new InternalServerError(error, 'Brevo error');
    }
  }

  async onPasswordReset(user: User, token: string) {
    const { subject, content } = resetPassword(user, token);
    try {
      await mailClient.sendMail(user, subject, content);
    } catch (error) {
      throw new InternalServerError(error, 'Brevo error');
    }
  }
}

export default new MailService();
