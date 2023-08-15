import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ApiKeyStrategy } from './auth.strategy';
import { AuthService } from './auth.service';

@Module({
    providers: [ApiKeyStrategy, AuthService],
    exports: [AuthService],
    imports: [PassportModule],
})
export class AuthModule {}
