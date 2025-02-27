import { PaginationDto } from './dto/pagination.dto';
export declare const getPaginationFilter: (pagination: PaginationDto) => {
    take: number;
    skip: number;
};
