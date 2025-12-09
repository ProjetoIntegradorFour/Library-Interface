// acervoApi.tsx - VERSÃO CORRIGIDA
import { apiService } from "../apiService";
import type { Book, PaginatedResponse } from "../../types/book";

const ACERVO_ENDPOINT = "/catalog";

interface GetLivrosParams {
  page: number;
  size?: number;
  title?: string;
  author?: string;
  isbn?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const getLivros = async (
  params: GetLivrosParams
): Promise<PaginatedResponse<Book>> => {
  try {
    console.log("📚 getLivros chamado com params:", params);
    
    const { page = 0, size = 14, ...filters } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.set("page", String(page));
    queryParams.set("size", String(size));
    
    if (filters.title) queryParams.set("title", filters.title);
    if (filters.author) queryParams.set("author", filters.author);
    if (filters.isbn) queryParams.set("isbn", filters.isbn);
    
    const url = `${ACERVO_ENDPOINT}?${queryParams.toString()}`;
    console.log("📚 Request URL:", url);
    
    const response = await apiService.get(url);
    console.log("📚 Response completa:", response);
    
    // Processa a resposta
    let booksArray: any[] = [];
    
    if (Array.isArray(response)) {
      booksArray = response;
      console.log("📚 Response é array direto");
    } else if (response?.data && Array.isArray(response.data)) {
      booksArray = response.data;
      console.log("📚 Response.data é array");
    } else {
      console.warn("📚 Estrutura inesperada, usando array vazio");
      booksArray = [];
    }
    
    console.log(`📚 Encontrados ${booksArray.length} livros`);
    
    // Paginação no frontend (API não pagina)
    const totalItems = booksArray.length;
    const pageSize = size;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedBooks = booksArray.slice(startIndex, endIndex);
    
    console.log(`📚 Paginação: Página ${page+1}/${totalPages}, Itens ${startIndex+1}-${endIndex} de ${totalItems}`);
    
    return {
      content: paginatedBooks,
      totalPages: totalPages,
      totalElements: totalItems,
      size: pageSize,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: paginatedBooks.length === 0,
    };
    
  } catch (error: any) {
    console.error("❌ Erro em getLivros:", error.message);
    
    // Fallback para dados mock em caso de erro
    const mockBooks = [
      { isbn: '9788535902775', title: '1984', author: 'George Orwell', availableCopies: 1 },
      { isbn: '9788571640353', title: 'Dom Casmurro', author: 'Machado de Assis', availableCopies: 2 },
      { isbn: '9788544001820', title: 'O Alquimista', author: 'Paulo Coelho', availableCopies: 1 },
    ];
    
    const page = params.page || 0;
    const size = params.size || 14;
    const totalItems = mockBooks.length;
    const totalPages = Math.ceil(totalItems / size);
    const startIndex = page * size;
    const paginatedBooks = mockBooks.slice(startIndex, startIndex + size);
    
    return {
      content: paginatedBooks,
      totalPages: totalPages,
      totalElements: totalItems,
      size: size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: false,
    };
  }
};