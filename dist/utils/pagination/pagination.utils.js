"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationFilter = void 0;
const getPaginationFilter = (pagination) => {
    const { page, perPage } = pagination;
    return {
        take: perPage,
        skip: (page - 1) * perPage,
    };
};
exports.getPaginationFilter = getPaginationFilter;
//# sourceMappingURL=pagination.utils.js.map