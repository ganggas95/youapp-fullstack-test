import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const customValidationPipe = new ValidationPipe({
    stopAtFirstError: true,
    exceptionFactory(errors) {
        const errorsResponse = {};
        errors.forEach((error) => {
            errorsResponse[error.property] = Object.keys(error.constraints)
                .map(
                    (key) => error.constraints[key],
                );
        });
        return new BadRequestException({
            message: 'Validation failed',
            data: errorsResponse,
        });
    },
});
