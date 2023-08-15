import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    validatePublicKey(apiKey: string): boolean {
        return apiKey === process.env.FAKE_PUBLIC_KEY;
    }
}
