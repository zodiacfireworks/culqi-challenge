import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { TokensController } from './tokens.controller';

describe('TokensService', () => {
    let controller: TokensController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TokensController],
            providers: [TokensService],
            imports: [DatabaseModule, CryptographyModule],
        }).compile();

        controller = module.get<TokensController>(TokensController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        const data = {
            cardNumber: 4111111111111111,
            cvv: 123,
            expirationYear: '2025',
            expirationMonth: '09',
            email: 'somebody@gmail.com',
        };

        it('should create a token', async () => {
            const result = await controller.create(data);

            expect(result.token).toBeDefined();
        });

        it('should create a token with a format /^tkn_[0-9a-zA-Z]{16}$/', async () => {
            const result = await controller.create(data);

            expect(result.token).toMatch(/^tkn_[0-9a-zA-Z]{16}$/);
        });
    });

    describe('validate', () => {
        const data = {
            cardNumber: 4111111111111111,
            cvv: 123,
            expirationYear: '2025',
            expirationMonth: '09',
            email: 'someone@email.com',
        };

        const nonexistentToken = 'tkn_1234567890123456';

        it('should validate a token', async () => {
            const { token } = await controller.create(data);

            const result = await controller.validate({ token });

            expect(result).toBeDefined();
            expect(result.email).toBe(data.email);
            expect(result.cardNumber).toBe(data.cardNumber);
            expect(result.expirationYear).toBe(data.expirationYear);
            expect(result.expirationMonth).toBe(data.expirationMonth);
        });

        it('should throw an error if token does not exist', async () => {
            await expect(
                controller.validate({ token: nonexistentToken }),
            ).rejects.toThrow("Token doesn't exist");
        });
    });
});
