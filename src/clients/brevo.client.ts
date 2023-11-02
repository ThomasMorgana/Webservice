import { MailDTO } from '../services/mail.service';
import { logger } from '../utils/logger';
import { postData } from './helper.client';

class BrevoClient {
  sendMail(data: MailDTO) {
    logger.info('mailll');
    postData('https://api.brevo.com/v3/smtp/email', data);
  }
}

export default new BrevoClient();
