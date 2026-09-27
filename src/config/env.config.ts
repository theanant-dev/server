import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

const envConfig = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
}

export default envConfig;