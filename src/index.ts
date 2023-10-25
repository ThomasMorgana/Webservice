import express, { Application } from 'express';
import Routes from './routes';
import { rateLimit } from 'express-rate-limit';

export default class Server {
	constructor(app: Application) {
		this.config(app);
		new Routes(app);
	}

	private config(app: Application): void {
		const limiter = rateLimit({
			windowMs: 1 * 60 * 1000,
			limit: 10,
			standardHeaders: 'draft-7',
			message: 'Leave me alone now!',
			legacyHeaders: false, 
		});

		app.use(express.json());
		app.use(limiter);
		app.use(express.urlencoded({ extended: true }));
	}
}
