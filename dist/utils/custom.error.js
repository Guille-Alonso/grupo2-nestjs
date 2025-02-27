"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class CustomError extends common_1.HttpException {
    constructor(message, statusCode) {
        super(message, statusCode);
    }
}
exports.default = CustomError;
//# sourceMappingURL=custom.error.js.map