import express, { Application } from 'express';
import Server from './src/index';

const app: Application = express();
new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8082;

app
	.listen(PORT, 'localhost', function () {
		console.log(`Server is running on port ${PORT}.`);
	})
	.on('error', () => {
		console.log('The server could not start');
	});
