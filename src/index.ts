import { Express } from 'express';
import { Server } from './utils/server';

const app = Server.getServer();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8082;

// eslint-disable-next-line no-shadow
const initialize = async (app: Express) => {
  try {
    app.listen(PORT || 8082, () => {
      console.info(`Server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

initialize(app);
