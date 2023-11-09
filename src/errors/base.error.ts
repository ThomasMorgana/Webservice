import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

export class CodedError extends Error {
  public STATUS_CODE: number;

  constructor(message?: string, code?: number, error?: unknown) {
    super(message ?? ReasonPhrases.INTERNAL_SERVER_ERROR);
    this.STATUS_CODE = code ?? StatusCodes.INTERNAL_SERVER_ERROR;
    logger.error(
      `CodedError(${this.message}, ${this.STATUS_CODE}) generated from error : ${error}` ?? 'An internal error occured',
    );
  }
}

export class EntityNotFoundError extends CodedError {
  constructor(entityName: string, entityId: string, error?: unknown) {
    super(`${entityName} with id=${entityId} not found`, StatusCodes.NOT_FOUND, error);
  }
}

export class InternalServerError extends CodedError {
  constructor(error?: unknown, message?: string) {
    super(message ?? ReasonPhrases.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
}

export class BadRequestError extends CodedError {
  constructor(error?: unknown, message?: string) {
    super(message ?? ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST, error);
  }
}
