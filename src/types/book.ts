export interface Book {
  id: number;
  cdd: string;
  titulo: string;
  autor: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;   // quantidade de itens por página
  number: number; // número da página atual
}
