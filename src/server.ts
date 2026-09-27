import http from "http";
import app from "./app";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Example: Connect to database here before starting server

server.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
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
