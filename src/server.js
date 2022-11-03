/**
 * @format
 * @module cors is middleware allows us to enable cors with many options to customize and short for express
 * @module morgan is middleware morgan used to request logger
 * @module dotenv is library  loads environment variables from a .env file into process.env
 */

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth';
import privateRouter from './routes/privateRoute';
import connectDB from './config/db';
import errorHandler from './middleware/error';
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 2812;

class Server {
  /**
   * @method middleware to use the app's middleware
   * @module router to use the app's routers
   * @module listenServer to listen if the server is working properly.
   */
  constructor() {
    this.init();
    this.middleware();
    this.router();
    this.listenServer();
  }
  init() {
    connectDB();
  }
  middleware() {
    app.use(express.json());
    app.use(cors());
    app.use(morgan('combined'));
    app.use(express.urlencoded({ extended: true }));
    app.use(errorHandler);
  }
  router() {
    app.use('/api/v1/auth', authRouter);
    app.use("/api/v1/private", privateRouter);
  }
  listenServer() {
    const server = app.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    );
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Logged error: ${err}`);
      server.close(() => process.exit(1));
    });
  }
}

new Server();
