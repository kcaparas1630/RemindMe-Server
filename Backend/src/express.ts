import './db';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerConfig from './Config/SwaggerConfig';
import * as routers from './routes/index';
import logger from './Config/loggerConfig';
import errorHandler from './ErrorHandlers/ErrorHandler';

const morganFormat = ":method :url :status :response-time ms";

const app = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each ip to 10 requests per window/minute
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use(limiter);
app.use(passport.initialize());
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerConfig)));
// Logs using morgan
app.use(morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      logger.info(JSON.stringify(logObject));
    }
  }
}));
//Routes
app.use('/api', [routers.taskRouter, routers.userRouter, routers.healthRouter]);
app.use(errorHandler);

export default app;
