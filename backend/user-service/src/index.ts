import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import router from './routes';
import { handleErrors } from './middlewares/errorHandler';
import { loggingMiddleware } from './middlewares/logger';
import { GATEWAY_URL, NODE_ENV } from './config';
import { connectDatabase, createTablesIfNotExists } from './utils/db';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: NODE_ENV === 'production' ? GATEWAY_URL : '*' }));
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(loggingMiddleware);

// Routes
app.use('/user', router);

// Handles non-existing routes & methods
app.all('*', (req, res) => {
  res.sendStatus(405);
});

// Error Handling Middleware
app.use(handleErrors);

async function startServer() {
  await connectDatabase();
  await createTablesIfNotExists(true);

  app.listen(3000, '0.0.0.0', () => console.log('Auth Server is listening...'));
}

startServer();
