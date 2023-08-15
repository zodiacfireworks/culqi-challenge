import { ApiKeyGuard } from './auth.guard';

describe('ApiKeyGuard', () => {
    it('should be defined', () => {
        expect(new ApiKeyGuard()).toBeDefined();
    });
});
