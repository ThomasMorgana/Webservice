import pino from 'pino';
import Logger = pino.Logger;

export class ContextService {
  private static readonly DEFAULT_SERVER_PORT = 8082;

  constructor(
    readonly logger: Logger,
    readonly port: number,
  ) {}

  static from(): ContextService {
    const port = process.env.PORT ? parseInt(process.env.PORT) : ContextService.DEFAULT_SERVER_PORT;
    return new ContextService(pino(), port);
  }
}
