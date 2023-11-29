import { Response } from 'express';
import { CodedError } from '../errors/base.error';
import { logger } from './logger';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

export const errorHandler = (res: Response, error: unknown) => {
  if (error instanceof CodedError) {
    logger.error(error.message);
    return res.status(error.STATUS_CODE).send({ message: error.message });
  }

  if (error instanceof ZodError) {
    logger.error(error);
    return res.status(StatusCodes.BAD_REQUEST).send(error.issues);
  }

  if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error('Critical Unexpected Internal Server Error');
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    message: error instanceof Error ? error.message : ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
