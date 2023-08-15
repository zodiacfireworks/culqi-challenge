import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app/app.module';
import {
    CardNumberValidator,
    CVVValidator,
    ExpirationMonthValidator,
    ExpirationYearValidator,
    EmailDomainValidator,
    TokenValidator,
} from './../src/tokens/tokens.validators';

jest.useFakeTimers();

describe('AppController (e2e)', () => {
    let app: INestApplication;
    const cardNumberValidator = new CardNumberValidator();
    const cvvValidator = new CVVValidator();
    const expirationMonthValidator = new ExpirationMonthValidator();
    const expirationYearValidator = new ExpirationYearValidator();
    const emailDomainValidator = new EmailDomainValidator();
    const tokenValidator = new TokenValidator();

    const paymentCardsDataSet = [
        {
            data: {
                cardNumber: 4111111111111111,
                cvv: 123,
                expirationYear: '2025',
                expirationMonth: '09',
                email: 'somebody@gmail.com',
            },
            expectedResponseCode: 201,
            caseDescription: 'valid data (Visa, Gmail)',
            exceptionMessage: 'Success',
        },
        {
            data: {
                cardNumber: 5111111111111118,
                cvv: 139,
                expirationYear: '2025',
                expirationMonth: '06',
                email: 'somebody@hotmail.com',
            },
            expectedResponseCode: 201,
            caseDescription: 'valid data (MasterCard, Hotmail)',
            exceptionMessage: 'Success',
        },
        {
            data: {
                cardNumber: 371212121212122,
                cvv: 2841,
                expirationYear: '2025',
                expirationMonth: '11',
                email: 'somebody@gmail.com',
            },
            expectedResponseCode: 201,
            caseDescription: 'valid data (American Express, Gmail)',
            exceptionMessage: 'Success',
        },
        {
            data: {
                cardNumber: 36001212121210,
                cvv: 123,
                expirationYear: '2025',
                expirationMonth: '04',
                email: 'somebody@yahoo.es',
            },
            expectedResponseCode: 201,
            caseDescription: 'valid data (Diners Club, Yahoo ES)',
            exceptionMessage: 'Success',
        },
        {
            data: {
                cardNumber: 360012121212,
                cvv: 123,
                expirationYear: '2025',
                expirationMonth: '04',
                email: 'somebody@yahoo.es',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Payment card length mismatch)',
            exceptionMessage: cardNumberValidator.errorMessages.lengthMismatch,
        },
        {
            data: {
                cardNumber: 4000020000000000,
                cvv: 123,
                expirationYear: '2025',
                expirationMonth: '10',
                email: 'somebody@yahoo.es',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Payment card Luhn mismatch)',
            exceptionMessage: cardNumberValidator.errorMessages.invalidFormat,
        },
        {
            data: {
                cardNumber: 371212121212122,
                cvv: 123,
                expirationYear: '2025',
                expirationMonth: '11',
                email: 'somebody@yahoo.com',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Bad CVV)',
            exceptionMessage: cvvValidator.errorMessages.lengthMismatch,
        },
        {
            data: {
                cardNumber: 4111111111111111,
                cvv: 123,
                expirationYear: '2025',
                expirationMonth: '16',
                email: 'somebody@gmail.com',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Bad expiration month)',
            exceptionMessage:
                expirationMonthValidator.errorMessages.invalidDate,
        },
        {
            data: {
                cardNumber: 4111111111111111,
                cvv: 123,
                expirationYear: (new Date().getFullYear() + 10).toString(),
                expirationMonth: '09',
                email: 'somebody@gmail.com',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Bad expiration year)',
            exceptionMessage: expirationYearValidator.errorMessages.invalidDate,
        },
        {
            data: {
                cardNumber: 4111111111111111,
                cvv: 123,
                expirationYear: (new Date().getFullYear() - 1).toString(),
                expirationMonth: '09',
                email: 'somebody@gmail.com',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Expired card)',
            exceptionMessage: expirationYearValidator.errorMessages.expiredCard,
        },
        {
            data: {
                cardNumber: 4111111111111111,
                cvv: 123,
                expirationYear: '2025',
                expirationMonth: '09',
                email: 'somebody@gmail.co',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Bad email domain)',
            exceptionMessage: emailDomainValidator.errorMessages.invalidDomain,
        },
    ];

    const tokensDataSet = [
        {
            data: {
                token: 'tkn_1234567890',
            },
            expectedResponseCode: 400,
            caseDescription: 'invalid data (Bad format)',
            exceptionMessage: tokenValidator.errorMessages.invalidToken,
        },
        {
            data: {
                token: 'tkn_1234567890123456',
            },
            expectedResponseCode: 404,
            caseDescription: 'invalid data (Token not found)',
            exceptionMessage: "Token doesn't exist",
        },
    ];

    beforeEach(async () => {
        jest.useFakeTimers();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should exists', () => {
        expect(app).toBeDefined();
    });

    describe('Tokens endpoints', () => {
        it.each(paymentCardsDataSet)(
            `/v1/tokens (POST) For $caseDescription should return $expectedResponseCode ($exceptionMessage)`,
            ({ data, expectedResponseCode, exceptionMessage }) => {
                request(app.getHttpServer())
                    .post('/v1/tokens')
                    .send(data as Record<string, unknown>)
                    .expect(expectedResponseCode)
                    .expect((res) => {
                        if (expectedResponseCode === 201) {
                            expect(res.body).toHaveProperty('token');
                        } else {
                            expect(res.body).toHaveProperty('message');
                            expect(res.body.message).toBe(exceptionMessage);
                        }
                    });
            },
        );

        it('/v1/tokens/validate (POST) For valid token should return 201 (Success)', async () => {
            const { token } = await request(app.getHttpServer())
                .post('/v1/tokens')
                .send(paymentCardsDataSet[0].data as Record<string, unknown>)
                .then((res) => res.body);

            request(app.getHttpServer())
                .post('/v1/tokens/validate')
                .send({
                    token,
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('email');
                    expect(res.body).toHaveProperty('cardNumber');
                    expect(res.body).toHaveProperty('expirationYear');
                    expect(res.body).toHaveProperty('expirationMonth');
                });
        });

        it.each(tokensDataSet)(
            `/v1/tokens/validate (POST) For $caseDescription should return $expectedResponseCode ($exceptionMessage)`,
            ({ data, expectedResponseCode, exceptionMessage }) => {
                request(app.getHttpServer())
                    .post('/v1/tokens/validate')
                    .send(data as Record<string, unknown>)
                    .expect(expectedResponseCode)
                    .expect((res) => {
                        if (expectedResponseCode === 200) {
                            expect(res.body).toHaveProperty('email');
                            expect(res.body).toHaveProperty('cardNumber');
                            expect(res.body).toHaveProperty('expirationYear');
                            expect(res.body).toHaveProperty('expirationMonth');
                        } else {
                            expect(res.body).toHaveProperty('message');
                            expect(res.body.message).toBe(exceptionMessage);
                        }
                    });
            },
        );
    });

    afterAll(async () => {
        await app.close();
    });
});
