import http from 'http';
import app from './app';
import logger from "./core/logger/winston.logger";
import redisClient from './core/redis/redis.db';
import envConfig from './core/config/env.config';
const PORT = envConfig.PORT || 3000;
const server = http.createServer(app);

const startServer = () => {
  server.listen(PORT, () => {
    redisClient.connect().then(() => {
      logger.info("✅ Redis connected successfully");
    }).catch((err) => {
      logger.error("❌ Redis connection failed: " + err.message);
    });
    logger.info(
      `📑 Visit the documentation at: http://localhost:${PORT}`
    );
    logger.info("⚙️  Server is running on port: " + PORT);
  });
};

startServer();

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});