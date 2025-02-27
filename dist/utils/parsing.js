"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginate = Paginate;
function Paginate(data, total, pagination) {
    const { page, perPage } = pagination;
    const cantPages = Math.ceil(total / perPage);
    return {
        data,
        total,
        page,
        perPage,
        cantPages,
    };
}
//# sourceMappingURL=parsing.js.map