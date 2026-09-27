import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import requestIp from "request-ip";
import { globalErrorHandler } from './core/middlewares/error';
import { AppError } from './core/utils/AppError';
import rateLimit from 'express-rate-limit';
import morganMiddleware from './core/logger/morgan.logger';
import { ApiError } from './core/utils/apiHandler';
// import authRoutes from "./auth/app/routes/auth.routes";
import envConfig from './core/config/env.config';

const app: Application = express();

// Enable CORS
app.use(
  cors({
    origin:
      envConfig.cors_origin.includes("*")
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : envConfig.cors_origin, // For multiple cors origin for production. Refer https://github.com/hiteshchoudhary/apihub/blob/a846abd7a0795054f48c7eb3e71f3af36478fa96/.env.sample#L12C1-L12C12
    credentials: true,
  })
);
app.use(requestIp.mw());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: Request, res: Response) => {
    // request-ip attaches clientIp to the request, but TypeScript may not know the property.
    // Ensure we always return a string (fallback to req.ip or empty string).
    return (req as any).clientIp || (req?.ip?.replace(/:\d+[^:]*$/, '') || '');
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      {
        statusCode: options.statusCode || 500,
        message: `There are too many requests. You are only allowed ${options.max} requests per ${options.windowMs / 60000} minutes`
      }
    );
  },
});


app.use(limiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());

app.use(morganMiddleware);

// 2. ROUTES
// app.use('/api/v1', routes);
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API',
  });
});
// app.use('/api/v1/auth', authRoutes);

// 3. UNHANDLED ROUTES
app.all('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. GLOBAL ERROR HANDLER
app.use(globalErrorHandler);




export default app;
