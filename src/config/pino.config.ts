export const loggerConfig = {
  name: 'webservice',
  level: 'debug',
  transport: {
    target: 'pino-pretty',
  },
};

export const logRequestConfig = {
  level: 'info',
  // TODO: Set to "true" in production
  autoLogging: false,
  transport: {
    target: 'pino-pretty',
  },
};
