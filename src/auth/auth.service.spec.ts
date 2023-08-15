import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        service = new AuthService();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateApiKey', () => {
        it('should return true if api key is valid', () => {
            const result = service.validatePublicKey(
                process.env.FAKE_PUBLIC_KEY as string,
            );

            expect(result).toBe(true);
        });

        it('should return false if api key is invalid', () => {
            const result = service.validatePublicKey('invalid-api-key');

            expect(result).toBe(false);
        });
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
});
