import { HttpException, HttpStatus } from '@nestjs/common';

import { ResponseDTO } from './dto';
import { BaseError } from './error';

export class BaseController {

    /**
     * Generates response based on the type of data.
     *
     * @param {ResponseDTO<T>} responseDto - the response object to be returned
     * @return {ResponseDTO<T>} the response object
     */
    response<T>(responseDto: ResponseDTO<T>) {
        return responseDto;
    }
    /**
     * Generates error response based on the type of error.
     *
     * @param {Error | BaseError} error - the error object to be handled
     * @return {void} no return value
     */
    errorResponse(error: Error | BaseError) {
        if (error instanceof BaseError) {
            throw new HttpException(
                this.response({
                    data: error.data,
                    message: error.message
                }), error.status);
        }
        if (process.env.NODE_ENV === 'production') {
            throw new HttpException(
                this.response({
                    data: null,
                    message: error.message
                }), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw error
    }
}