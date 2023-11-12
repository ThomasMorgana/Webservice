import { User } from '@prisma/client';

export const EmailData = (receiver: User, subject: string, content: string) => {
  return {
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
};

export const RequestOptions = (body: string) => {
  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: body,
  } as RequestInit;
};
