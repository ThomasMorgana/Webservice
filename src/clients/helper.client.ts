import { MailDTO } from '../services/mail.service';
import { logger } from '../utils/logger';

export const postData = async (url: string = '', data: MailDTO) => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'api-key': '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',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });
  logger.info(response);
  return response;
};
