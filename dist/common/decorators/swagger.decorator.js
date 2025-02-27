"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCustomOperation = ApiCustomOperation;
const swagger_1 = require("@nestjs/swagger");
function ApiCustomOperation(options) {
    return function (target, key, descriptor) {
        (0, swagger_1.ApiOperation)({ summary: options.summary })(target, key, descriptor);
        if (options.bodyType) {
            (0, swagger_1.ApiBody)({ type: options.bodyType })(target, key, descriptor);
        }
        if (options.responseStatus && options.responseDescription) {
            (0, swagger_1.ApiResponse)({
                status: options.responseStatus,
                description: options.responseDescription,
            })(target, key, descriptor);
        }
    };
}
//# sourceMappingURL=swagger.decorator.js.map