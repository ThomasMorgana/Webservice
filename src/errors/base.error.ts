export class CodedError extends Error {
  public STATUS_CODE: number;

  constructor(message?: string, code?: number) {
    super(message ?? 'Internal Server Error');
    this.STATUS_CODE = code ?? 500;
  }
}
