import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
// import routes from './routes';
import { globalErrorHandler } from "./middlewares/error";
import { AppError } from "./utils/AppError";

const app: Application = express();
dotenv.config({ path: "./.env" });
// 1. GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json({ limit: "10kb" }));

// Enable CORS
app.use(cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 2. ROUTES
// app.use('/api/v1', routes);

// 3. UNHANDLED ROUTES
app.all("/{*splat}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
