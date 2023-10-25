export class MailNotFoundError extends Error {
  constructor() {
    super('No account with this email has been found');
  }
}

export class MailAlreadyUsedError extends Error {
  constructor() {
    super('An account with this email is already present');
  }
}

export class IncorrectPasswordError extends Error {
  constructor() {
    super("These credentials don't match");
  }
}
