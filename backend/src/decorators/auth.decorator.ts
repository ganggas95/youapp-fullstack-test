import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthGuard } from '@/guards/auth.guard';

export function AuthRequired() {
    return applyDecorators(
        UseGuards(AuthGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse(
            {
                status: HttpStatus.UNAUTHORIZED,
                description: 'Unauthorized'
            }
        ),
    )
}