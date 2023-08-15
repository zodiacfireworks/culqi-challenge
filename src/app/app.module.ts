import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '../auth/auth.module';
import { TokensModule } from '../tokens/tokens.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const newrelicPinoConfig = require('@newrelic/pino-enricher');

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                ...newrelicPinoConfig(),
                level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                transport:
                    process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty' }
                        : undefined,
            },
        }),
        AuthModule,
        TokensModule,
    ],
})
export class AppModule {}
