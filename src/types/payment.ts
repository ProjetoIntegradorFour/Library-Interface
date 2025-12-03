export interface Payment {
    id: number;
    userName: string;
    bookTitle: string;
    fineAmount: number;
    dueDate: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}