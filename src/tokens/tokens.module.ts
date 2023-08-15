import { Module } from '@nestjs/common';

import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';

@Module({
    controllers: [TokensController],
    providers: [TokensService],
    imports: [CryptographyModule, DatabaseModule],
})
export class TokensModule {}
