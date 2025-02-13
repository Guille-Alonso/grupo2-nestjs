import { PaginationDto } from './dto/pagination.dto';

export const getPaginationFilter = (pagination: PaginationDto) => {
  const { page, perPage } = pagination;
  return {
    take: perPage,
    skip: (page - 1) * perPage,
  };
};
