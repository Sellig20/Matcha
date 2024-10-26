import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    disableOfflineQueue: true,
});

client.on('connect', () => {
    console.log("\n\n⚜️ ⚜️ ⚜️ ⚜️ ⚜️ ⚜️ ⚜️ ⚜️ Connected to Redis ⚜️ ⚜️ ⚜️ ⚜️ ⚜️ ⚜️ ⚜️ ⚜️\n\n");
});

client.on('error', (error: string) => {
    console.error(`Redis connection error : ${error}`);
});

async function connectRedis() {
    try {
        await client.connect();
    } catch (error) {
        console.error('Could not connect to Redis:', error);
    }
}

export { connectRedis };

