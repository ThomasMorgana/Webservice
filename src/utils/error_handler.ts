import { Response } from 'express';
import { CodedError } from '../errors/base.error';
import { logger } from './logger';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const errorHandler = (res: Response, error: unknown) => {
  logger.error(error);
  if (error instanceof CodedError) {
    return res.status(error.STATUS_CODE).send({ message: error.message });
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
