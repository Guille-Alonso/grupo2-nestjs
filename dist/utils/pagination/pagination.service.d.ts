export declare class PaginationService {
    getPaginationParams(page: number, pageSize: number, sortBy: string, sortOrder: 'asc' | 'desc'): {
        skip: number;
        take: number;
        orderBy: {
            [x: string]: "asc" | "desc";
        };
    };
    formatPaginatedResponse<T>(data: T[], total: number, page: number, pageSize: number): {
        data: T[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    };
}
