import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptographyService {
    private tokenLength = 16;

    generateRandomToken(): string {
        const randomToken = Array.from(Array(this.tokenLength), () =>
            Math.floor(Math.random() * 36).toString(36),
        ).join('');

        if (randomToken.length !== this.tokenLength) {
            return this.generateRandomToken();
        }

        return randomToken;
    }
}
