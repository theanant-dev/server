import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const envConfig = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    isNodeEnvDevelopment: process.env.NODE_ENV === "development",
    cors_origin: process.env.CORS_ORIGIN || "http://localhost:3000",

    // Redis configuration
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",

    // sms configuration
    smsApiKey: process.env.SMS_API_KEY || "",
    smsApiUrl: process.env.SMS_API_URL || "",
    smsWidgetId: process.env.SMS_WIDGET_ID || "",

    // email configuration
    emailHost: process.env.EMAIL_HOST || "",
    emailPort: process.env.EMAIL_PORT || "",
    emailUser: process.env.EMAIL_USER || "",
    emailPass: process.env.EMAIL_PASS || "",
    emailFrom: process.env.EMAIL_FROM || "",
};
export default envConfig;
