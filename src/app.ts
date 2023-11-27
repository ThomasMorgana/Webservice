import express, { Application } from 'express';
import Server from './utils/server';
import { ContextService } from './utils/context.service';

const app: Application = express();

const contextService = ContextService.from();

Server.from(app, contextService).start();
