import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { DatabaseService } from './database.service';

@Module({
    providers: [DatabaseService],
    exports: [DatabaseService],
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
})
export class DatabaseModule {}
