import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerErrorInterceptor, Logger } from 'nestjs-pino';

import { AppModule } from './app/app.module';
import { ObservabilityInterceptor } from './observability/observability.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.useLogger(app.get(Logger));
    app.flushLogs();

    app.getHttpAdapter().getInstance().disable('x-powered-by');

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    app.useGlobalInterceptors(new ObservabilityInterceptor());

    app.enableVersioning({ type: VersioningType.URI });

    const config = new DocumentBuilder()
        .setTitle('Payment Card Tokenization Service')
        .setDescription(
            'API documentation for the payment card tokenization service.',
        )
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-api-key',
                in: 'header',
                description: 'API Key For External calls',
            },
            'headerapikey',
        )
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    await app.listen(3000);
}
bootstrap();
