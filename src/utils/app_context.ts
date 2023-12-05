import pino from 'pino';
import Logger = pino.Logger;

export class AppContext {
  private static readonly DEFAULT_SERVER_PORT = 8082;

  constructor(
    readonly logger: Logger,
    readonly port: number,
  ) {}

  static from(): AppContext {
    const port = process.env.PORT ? parseInt(process.env.PORT) : AppContext.DEFAULT_SERVER_PORT;
    return new AppContext(pino(), port);
  }
}
