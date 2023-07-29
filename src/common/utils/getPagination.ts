export type Pagination = {
    skip: number, take: number, totalResults: number, totalRegisters: number
}
export type PaginationResult = {

    actualPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    previous: number;
    next: number;
    missing: number;
    totalRegisters: number;
    totalResults: number;
}
export const getPagination = ({ skip, take, totalResults, totalRegisters }: Pagination): PaginationResult => {
    let hasPrevious = false, previous = 0, hasNext = false, next = totalRegisters - (skip + take);
    const actualPage = parseInt(((skip / take) + 1).toString());
    const missing = totalRegisters - totalResults;
    if (totalResults) {
        if (skip != 0) {
            hasPrevious = true;
            previous = skip;
        }
    }
    if (missing === totalRegisters) {
        hasPrevious = true;
        previous = totalRegisters;
    }
    if (next <= 0) {
        next = 0;
        hasNext = false;
    } else
        hasNext = true;

    return {
        actualPage,
        hasPrevious,
        previous,
        hasNext,
        next,
        missing,
        totalResults,
        totalRegisters
    };
}