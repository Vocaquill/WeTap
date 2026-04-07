export interface IBaseSearch {
    page: number;
    itemPerPage: number;
}

export interface IPagedResult<T> {
    items: T[];
    pagination: {
        totalCount: number;
        totalPages: number;
        itemsPerPage: number;
        currentPage: number;
    };
}

export interface IServerValidationErrors {
    [field: string]: string[];
}