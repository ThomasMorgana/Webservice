import { Response } from 'express';
import { CodedError } from '../errors/base.error';
import { logger } from './logger';

export const errorHandler = (res: Response, error: unknown) => {
  logger.error(error);
  if (error instanceof CodedError) {
    return res.status(error.STATUS_CODE).send({ message: error.message });
  } else {
    return res.status(500).send({ message: 'Internal Server Error!' });
  }
};
