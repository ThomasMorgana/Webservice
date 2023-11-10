import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Webservice',
      version: '1.0.0',
      description: 'A framework API',
    },
    host: `localhost:${process.env.PORT}`,
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api`,
        description: 'local server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
