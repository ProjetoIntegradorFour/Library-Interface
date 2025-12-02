export interface Loan {
    id: number;
    userName: string;
    bookName: string;
    status: string;
    dataLoan: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}