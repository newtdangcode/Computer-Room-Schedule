export type PaginatedResource<T> = {
    data: T[];
    total: number;
    limit: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    lastPage: number;
};