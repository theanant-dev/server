import http from "http";
import app from "./app";
import envConfig from "./config/env.config";

const PORT = envConfig.PORT;
const server = http.createServer(app);

// Example: Connect to database here before starting server

server.listen(PORT, () => {
  console.log(
    ` Server running in ${envConfig.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
