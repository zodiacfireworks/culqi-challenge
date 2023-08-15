import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private authService: AuthService) {
        super(
            { header: 'x-api-key', prefix: '' },
            true,
            (apikey: string, done: any) => {
                if (!authService.validatePublicKey(apikey)) {
                    return done(null, false);
                }
                return done(null, true);
            },
        );
    }
}
