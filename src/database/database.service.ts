import { Injectable } from '@nestjs/common';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { Redis, RedisKey } from 'ioredis';

@Injectable()
export class DatabaseService {
    public readonly expirationTime: number = process.env.REDIS_EXPIRATION_TIME
        ? parseInt(process.env.REDIS_EXPIRATION_TIME)
        : 60 * 15; // 15 minutes in seconds by default

    constructor(
        @InjectRedis(DEFAULT_REDIS_NAMESPACE) public readonly redis: Redis,
    ) {}

    async set(key: RedisKey, value: string): Promise<string> {
        return await this.redis.set(key, value, 'EX', this.expirationTime);
    }

    async get(key: RedisKey): Promise<string | null> {
        return await this.redis.get(key);
    }
}
