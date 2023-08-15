import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
    let service: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseService],
            imports: [
                RedisModule.forRoot({
                    config: {
                        host: process.env.REDIS_HOST,
                        port: process.env.REDIS_PORT
                            ? parseInt(process.env.REDIS_PORT, 10)
                            : 6379,
                    },
                }),
            ],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have a redis client', () => {
        expect(service.redis).toBeDefined();
    });

    it('should have an expiration time', () => {
        expect(service.expirationTime).toBeDefined();
    });

    describe('set', () => {
        it('should set a value', async () => {
            const key = 'key';
            const value = 'value';
            const result = await service.set(key, value);

            expect(result).toBe('OK');
        });
    });

    describe('get', () => {
        it('should get a value', async () => {
            const key = 'key';
            const value = 'value';
            await service.set(key, value);
            const result = await service.get(key);

            expect(result).toBe(value);
        });

        it('should return null if key does not exist', async () => {
            const key = 'non-exitent-key';
            const result = await service.get(key);

            expect(result).toBeNull();
        });

        it('should return null if key has expired', async () => {
            const key = 'expired-key';
            const value = 'value';
            await service.set(key, value);
            await new Promise((resolve) => {
                const timeout = setTimeout(
                    resolve,
                    (service.expirationTime + 0.5) * 1000,
                );
                timeout.unref();
            });
            const result = await service.get(key);

            expect(result).toBeNull();
        });
    });

    afterAll(() => {
        service.redis.disconnect();
    });
});
