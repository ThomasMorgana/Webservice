import express, { Application } from 'express';
import { AppContext } from './utils/app_context';
import Server from './utils/server';

const app: Application = express();

const appContext = AppContext.from();
Server.from(app, appContext).start();
