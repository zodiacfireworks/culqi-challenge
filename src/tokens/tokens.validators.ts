import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTokenPayload } from './tokens.dto';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

class CardType {
    name: string;
    length: number[];
    cvvLength: number;
    prefixes: string[];
    checkdigit: boolean;
}

const CardTypes: CardType[] = [
    {
        name: 'Visa',
        length: [13, 16],
        cvvLength: 3,
        prefixes: ['4'],
        checkdigit: true,
    },
    {
        name: 'MasterCard',
        length: [16],
        cvvLength: 3,
        prefixes: ['51', '52', '53', '54', '55'],
        checkdigit: true,
    },
    {
        name: 'DinersClub',
        length: [14, 16],
        cvvLength: 3,
        prefixes: ['36', '38', '54', '55'],
        checkdigit: true,
    },
    {
        name: 'AmEx',
        length: [15],
        cvvLength: 4,
        prefixes: ['34', '37'],
        checkdigit: true,
    },
];

@ValidatorConstraint({ name: 'cardNumber' })
@Injectable()
export class CardNumberValidator implements ValidatorConstraintInterface {
    public readonly errorMessages = {
        unknownFormat: 'Unknown card type',
        invalidFormat: 'Payment card number is in invalid format',
        lengthMismatch:
            'Payment card number has an inappropriate number of digits',
    };

    private cardTypes: CardType[] = CardTypes;

    getCardType(cardNumber: string): CardType {
        for (const cardType of this.cardTypes) {
            for (const prefix of cardType.prefixes) {
                if (cardNumber.startsWith(prefix)) {
                    return cardType;
                }
            }
        }

        throw new BadRequestException(this.errorMessages.unknownFormat);
    }

    validateLength(cardNumber: string, cardType: CardType): boolean {
        const cardNumberLength = cardNumber.length;

        if (cardType['length'].includes(cardNumberLength)) {
            return true;
        }

        throw new BadRequestException(this.errorMessages.lengthMismatch);
    }

    validateLengthRange(cardNumber: string): boolean {
        const regex = new RegExp('^[0-9]{13,19}$');

        if (regex.test(cardNumber)) {
            return true;
        }

        throw new BadRequestException(this.errorMessages.lengthMismatch);
    }

    validateLuhn(cardNumber: string) {
        let checksum = 0;
        let isPairPosition = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);

            if (isPairPosition == true) digit = digit * 2;

            checksum += parseInt((digit / 10).toString(), 10);
            checksum += digit % 10;

            isPairPosition = !isPairPosition;
        }

        if (checksum % 10 == 0) {
            return true;
        }

        throw new BadRequestException(this.errorMessages.invalidFormat);
    }

    validate(value: number): boolean {
        const cardNumber = JSON.stringify(value);

        this.validateLengthRange(cardNumber);
        this.validateLuhn(cardNumber);

        const cardType = this.getCardType(cardNumber);
        this.validateLength(cardNumber, cardType);

        return true;
    }
}

@ValidatorConstraint({ name: 'cvv' })
@Injectable()
export class CVVValidator implements ValidatorConstraintInterface {
    public readonly errorMessages = {
        lengthMismatch: 'CVV has an inappropriate number of digits',
    };

    validateLength(cardNumber: string, cvv: string): boolean {
        const cardType = new CardNumberValidator().getCardType(cardNumber);

        if (cvv.length !== cardType.cvvLength) {
            throw new BadRequestException(this.errorMessages.lengthMismatch);
        }

        return true;
    }

    validate(value: string, args: ValidationArguments): boolean {
        const cvv = JSON.stringify(value);
        const cardNumber = JSON.stringify(
            (args.object as CreateTokenPayload).cardNumber,
        );

        this.validateLength(cardNumber, cvv);

        return true;
    }
}

@ValidatorConstraint({ name: 'expirationMonth' })
@Injectable()
export class ExpirationMonthValidator implements ValidatorConstraintInterface {
    public readonly errorMessages = {
        invalidDate: 'Invalid expiration date',
    };

    validate(value: string): boolean {
        const expirationMonth = parseInt(value);

        if (expirationMonth > 1 || expirationMonth < 12) {
            return true;
        }

        throw new BadRequestException(this.errorMessages.invalidDate);
    }
}

@ValidatorConstraint({ name: 'expirationYear' })
@Injectable()
export class ExpirationYearValidator implements ValidatorConstraintInterface {
    public readonly errorMessages = {
        invalidDate: 'Invalid expiration date',
        expiredCard: 'Card has expired',
    };

    validate(value: string, args: ValidationArguments): boolean {
        const expirationYear = parseInt(value);
        const expirationMonth = parseInt(
            (args.object as CreateTokenPayload).expirationMonth,
        );

        const expirationDate = new Date(expirationYear, expirationMonth);
        const today = new Date();

        if (expirationDate > today) {
            const differenceInMilliseconds =
                expirationDate.getTime() - today.getTime();

            const differenceInYears =
                differenceInMilliseconds / (1000 * 3600 * 24 * 365);

            if (differenceInYears <= 5) {
                return true;
            }

            throw new BadRequestException(this.errorMessages.invalidDate);
        }

        throw new BadRequestException(this.errorMessages.expiredCard);
    }
}

@ValidatorConstraint({ name: 'email' })
@Injectable()
export class EmailDomainValidator implements ValidatorConstraintInterface {
    private allowedDomains = ['gmail.com', 'yahoo.es', 'hotmail.com'];

    public readonly errorMessages = {
        invalidDomain: 'Email domain is invalid',
    };

    validateDomains(email: string): boolean {
        const emailDomain = email.split('@')[1];

        if (this.allowedDomains.includes(emailDomain)) {
            return true;
        }

        throw new BadRequestException(this.errorMessages.invalidDomain);
    }

    validate(value: string): boolean {
        this.validateDomains(value);

        return true;
    }
}

@ValidatorConstraint({ name: 'email' })
@Injectable()
export class TokenValidator implements ValidatorConstraintInterface {
    public readonly errorMessages = {
        invalidToken: 'Token is invalid',
    };

    validateFormat(token: string): boolean {
        const regex = new RegExp('^tkn_([0-9A-Za-z]{16})$');

        if (regex.test(token)) {
            return true;
        }

        throw new BadRequestException(this.errorMessages.invalidToken);
    }

    validate(value: string): boolean {
        this.validateFormat(value);

        return true;
    }
}
