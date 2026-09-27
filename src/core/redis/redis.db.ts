import { createClient } from 'redis';
import env from '../config/env.config';
const redisClient = createClient({
    url: env.redisUrl
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
export default redisClient;