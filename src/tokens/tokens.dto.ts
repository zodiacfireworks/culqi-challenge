import { IsString, IsInt, IsEmail, Validate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    EmailDomainValidator,
    CardNumberValidator,
    CVVValidator,
    ExpirationMonthValidator,
    ExpirationYearValidator,
    TokenValidator,
} from './tokens.validators';

export class CreateTokenPayload {
    @ApiProperty({
        description: 'Payment card number',
        example: 4111111111111111,
    })
    @IsInt()
    @Validate(CardNumberValidator)
    cardNumber: number;

    @ApiProperty({
        description: 'CVV',
        example: 123,
    })
    @IsInt()
    @Validate(CVVValidator)
    cvv: number;

    @ApiProperty({
        description: 'Two digit expiration month',
        example: '01',
    })
    @IsString()
    @Validate(ExpirationMonthValidator)
    expirationMonth: string;

    @ApiProperty({
        description: 'Four digit expiration year',
        example: '2026',
    })
    @IsString()
    @Validate(ExpirationYearValidator)
    expirationYear: string;

    @ApiProperty({
        description: 'Card holder email address',
        example: 'somebody@gmail.com',
    })
    @IsEmail()
    @Validate(EmailDomainValidator)
    email: string;
}

export class CreateTokenResponseBody {
    @ApiProperty()
    @IsString()
    token: string;
}

export class ValidateTokenPayload {
    @ApiProperty({
        description: 'Token to validate',
        example: 'tkn_1qAz2wSx3eDc4rFv',
    })
    @IsString()
    @Validate(TokenValidator)
    token: string;
}

export class ValidateTokenResponseBody {
    @ApiProperty()
    @IsInt()
    cardNumber: number;

    @ApiProperty()
    @IsString()
    expirationMonth: string;

    @ApiProperty()
    @IsString()
    expirationYear: string;

    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ErrorResponseBody {
    @ApiProperty({
        description: 'Descriptive error message',
        example: 'Invalid token',
    })
    @IsString()
    message: string;

    @ApiPropertyOptional({
        description: 'Http error description',
        example: 'Bad Request',
    })
    @IsString()
    error: string;

    @ApiProperty({
        description: 'HTTP status code',
        example: 400,
    })
    @IsInt()
    statusCode: number;
}
