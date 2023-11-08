import { CodedError } from './base.error';

enum STATUS {
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export class MailNotFoundError extends CodedError {
  constructor() {
    super('No account with this email has been found', STATUS.NOT_FOUND);
  }
}

export class UserNotFoundError extends CodedError {
  constructor() {
    super('No corresponding account has been found', STATUS.NOT_FOUND);
  }
}

export class MailAlreadyUsedError extends CodedError {
  constructor() {
    super('An account with this email is already present', STATUS.CONFLICT);
  }
}

export class IncorrectPasswordError extends CodedError {
  constructor() {
    super("These credentials don't match", STATUS.UNAUTHORIZED);
  }
}

export class ResetTokenInvalidError extends CodedError {
  constructor() {
    super('This token is either invalid or already used', STATUS.UNAUTHORIZED);
  }
}

export class ActivationTokenInvalidError extends CodedError {
  constructor() {
    super('The activation token is invalid', STATUS.UNAUTHORIZED);
  }
}
