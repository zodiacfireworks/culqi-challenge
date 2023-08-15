import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiSecurity,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiBadGatewayResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';

import { TokensService } from './tokens.service';
import {
    CreateTokenPayload,
    CreateTokenResponseBody,
    ValidateTokenPayload,
    ValidateTokenResponseBody,
    ErrorResponseBody,
} from './tokens.dto';
import { ApiKeyGuard } from '../auth/auth.guard';

@Controller({
    version: '1',
    path: 'tokens',
})
@ApiTags('Tokens')
@ApiBadRequestResponse({
    description: 'Bad Request',
    type: ErrorResponseBody,
})
@ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponseBody,
})
@ApiBadGatewayResponse({
    description: 'Bad Gateway',
    type: ErrorResponseBody,
})
@UseGuards(new ApiKeyGuard('headerapikey'))
@ApiSecurity('headerapikey')
export class TokensController {
    constructor(private readonly tokensService: TokensService) {}

    @Post()
    @ApiCreatedResponse({
        type: CreateTokenResponseBody,
        description: 'Token created successfully',
    })
    async create(
        @Body() payload: CreateTokenPayload,
    ): Promise<CreateTokenResponseBody> {
        return this.tokensService.create(payload);
    }

    @Post('validate')
    @HttpCode(200)
    @ApiOkResponse({
        type: ValidateTokenResponseBody,
        description: 'Token validated successfully',
    })
    async validate(
        @Body() payload: ValidateTokenPayload,
    ): Promise<ValidateTokenResponseBody> {
        return this.tokensService.validate(payload);
    }
}
