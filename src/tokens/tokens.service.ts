import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateTokenPayload,
    CreateTokenResponseBody,
    ValidateTokenPayload,
    ValidateTokenResponseBody,
} from './tokens.dto';
import { CryptographyService } from '../cryptography/cryptography.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TokensService {
    constructor(
        private readonly cryptographyService: CryptographyService,
        private readonly databaseService: DatabaseService,
    ) {}

    async create(data: CreateTokenPayload): Promise<CreateTokenResponseBody> {
        const token = `tkn_${this.cryptographyService.generateRandomToken()}`;

        await this.databaseService.set(token, JSON.stringify(data));

        return Promise.resolve({
            token,
        } as CreateTokenResponseBody);
    }

    async validate(
        data: ValidateTokenPayload,
    ): Promise<ValidateTokenResponseBody> {
        const { token } = data;
        const pipeline = this.databaseService.redis.pipeline();

        const result = await pipeline
            .ttl(token)
            .get(token)
            .exec((err, result) => {
                if (err) {
                    throw err as Error;
                }
                return result;
            });

        const [[, ttl], [, value]] = result as [
            error: Error | null,
            result: unknown,
        ][];

        if (value === null) {
            throw new NotFoundException("Token doesn't exist");
        }

        if ((ttl as number) <= 0) {
            throw new BadRequestException('Token has expired');
        }

        const { email, cardNumber, expirationYear, expirationMonth } =
            JSON.parse(value as string) as CreateTokenPayload;

        return Promise.resolve({
            email,
            cardNumber,
            expirationYear,
            expirationMonth,
        } as ValidateTokenResponseBody);
    }
}
