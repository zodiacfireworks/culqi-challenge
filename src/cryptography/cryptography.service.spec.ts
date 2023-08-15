import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyService } from './cryptography.service';

describe('CryptographyService', () => {
    let service: CryptographyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CryptographyService],
        }).compile();

        service = module.get<CryptographyService>(CryptographyService);
    });

    it('service should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateRandomToken', () => {
        it('should return a random token', () => {
            const token = service.generateRandomToken();

            expect(token).toBeDefined();
        });

        it('random token must have 16 characters', () => {
            const token = service.generateRandomToken();

            expect(token.length).toBe(16);
        });

        it('random token must have only alphanumeric characters', () => {
            const token = service.generateRandomToken();
            const regex = new RegExp('^[a-zA-Z0-9]{16}$');

            expect(regex.test(token)).toBe(true);
        });
    });
});
