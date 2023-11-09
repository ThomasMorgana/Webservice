import { StatusCodes } from 'http-status-codes';
import { CodedError } from './base.error';

export class MailNotFoundError extends CodedError {
  constructor() {
    super('No account with this email has been found', StatusCodes.NOT_FOUND);
  }
}

export class UserNotFoundError extends CodedError {
  constructor() {
    super('No corresponding account has been found', StatusCodes.NOT_FOUND);
  }
}

export class MailAlreadyUsedError extends CodedError {
  constructor() {
    super('An account with this email is already present', StatusCodes.CONFLICT);
  }
}

export class IncorrectPasswordError extends CodedError {
  constructor() {
    super("These credentials don't match", StatusCodes.UNAUTHORIZED);
  }
}

export class ResetTokenInvalidError extends CodedError {
  constructor() {
    super('This token is either invalid or already used', StatusCodes.UNAUTHORIZED);
  }
}

export class ActivationTokenInvalidError extends CodedError {
  constructor() {
    super('The activation token is invalid', StatusCodes.UNAUTHORIZED);
  }
}
