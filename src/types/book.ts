export interface Book {
  isbn: string,
  title: string,
  author: string,
  cover?: string,
  availableCopies?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
