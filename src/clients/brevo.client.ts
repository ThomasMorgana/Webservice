import { User } from '@prisma/client';
import { CodedError } from '../errors/base.error';
import { logger } from '../utils/logger';
import { EmailData, RequestOptions } from '../config';

export default class BrevoClient {
  private TRANSACTIONAL_URL = 'https://api.brevo.com/v3/smtp/email';

  async sendMail(receiver: User, subject: string, content: string) {
    const emailData = EmailData(receiver, subject, content);
    const body = JSON.stringify(emailData);
    const requestOptions: RequestInit = RequestOptions(body);

    try {
      const response = await fetch(this.TRANSACTIONAL_URL, requestOptions);
      if (!response.ok) {
        logger.info(`Failed to send email with data : ${body}`);
        throw new CodedError(`Brevo failed to send email: ${response.statusText}`);
      }
      logger.info(`Email sent with data : ${body}`);
    } catch (error) {
      logger.info(`Failed to send email with data : ${body}`);
      throw new CodedError(`Email sending error: ${error}`);
    }
  }
}
