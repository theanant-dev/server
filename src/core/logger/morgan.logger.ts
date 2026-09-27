import morgan from "morgan";
import logger from "./winston.logger.js";
type MorganStream = {
    write: (message: string) => void;
};

const stream: MorganStream = {
    write: (message) => logger.http(message.trim()),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

const morganMiddleware = morgan(
    ":remote-addr :method :url :status - :response-time ms",
    { stream, skip }
);

export default morganMiddleware;
