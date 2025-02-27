import { HttpException, HttpStatus } from '@nestjs/common';
declare class CustomError extends HttpException {
    constructor(message: string, statusCode: HttpStatus);
}
export default CustomError;
