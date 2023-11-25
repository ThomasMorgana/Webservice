import { User } from '@prisma/client';
import BrevoClient from '../clients/brevo.client';
import { welcomeUser, resetPassword } from '../assets/templates/mail';
import { InternalServerError } from '../errors/base.error';

export default class MailService {
  private client: BrevoClient = new BrevoClient();

  async onRegister(user: User, activationCode: string) {
    const { subject, content } = welcomeUser(user, activationCode);
    try {
      await this.client.sendMail(user, subject, content);
    } catch (error) {
      throw new InternalServerError(error, 'Brevo error');
    }
  }

  async onPasswordReset(user: User, token: string) {
    const { subject, content } = resetPassword(user, token);
    try {
      await this.client.sendMail(user, subject, content);
    } catch (error) {
      throw new InternalServerError(error, 'Brevo error');
    }
  }
}
