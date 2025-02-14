import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  getPaginationParams(page: number, pageSize: number, sortBy: string, sortOrder: 'asc' | 'desc') {
    const skip = (page - 1) * pageSize;
    return { skip, take: pageSize, orderBy: { [sortBy]: sortOrder } };
  }

  formatPaginatedResponse<T>(data: T[], total: number, page: number, pageSize: number) {
    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}