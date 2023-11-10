export const loggerConfig = {
  name: 'webservice',
  level: 'debug',
  // TODO: may cause a problem on prod env because pino-pretty is a dev dependency. Will probably need to be linked to the env.
  transport: {
    target: 'pino-pretty',
  },
};

export const logRequestConfig = {
  level: 'info',
  // TODO: Set to "true" in production
  autoLogging: false,
  // TODO: may cause a problem on prod env because pino-pretty is a dev dependency. Will probably need to be linked to the env.
  transport: {
    target: 'pino-pretty',
  },
};
