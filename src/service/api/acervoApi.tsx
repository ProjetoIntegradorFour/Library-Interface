// acervoApi.tsx - VERSÃO FINAL CORRIGIDA
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
    
    // DICA: Adicione este log para ver a estrutura EXATA
    console.log("🔍 Estrutura detalhada da resposta:", {
      tipo: typeof response,
      isResponse: response?.constructor?.name,
      keys: Object.keys(response || {}),
      hasContent: 'content' in response,
      contentIsArray: Array.isArray(response?.content),
      responseData: response
    });
    
    // CASO 1: Resposta é um objeto com propriedade 'content' (Spring Boot padrão)
    if (response && typeof response === 'object' && Array.isArray(response.content)) {
      console.log("✅ Resposta Spring Boot padrão detectada");
      return {
        content: response.content,
        totalPages: response.totalPages || 1,
        totalElements: response.totalElements || response.content.length,
        size: response.size || size,
        number: response.number || page,
        first: response.first !== undefined ? response.first : (page === 0),
        last: response.last !== undefined ? response.last : false,
        empty: response.empty !== undefined ? response.empty : (response.content.length === 0),
      };
    }
    
    // CASO 2: Resposta é array direto
    if (Array.isArray(response)) {
      console.log("⚠️ Resposta é array direto (API não paginada)");
      const pageNum = page || 0;
      const pageSize = size || 14;
      const totalItems = response.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      const startIndex = pageNum * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginatedContent = response.slice(startIndex, endIndex);
      
      return {
        content: paginatedContent,
        totalPages: totalPages,
        totalElements: totalItems,
        size: pageSize,
        number: pageNum,
        first: pageNum === 0,
        last: pageNum >= totalPages - 1,
        empty: paginatedContent.length === 0,
      };
    }
    
    // CASO 3: Resposta inválida ou inesperada
    console.warn("⚠️ Estrutura de resposta inesperada:", response);
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: size || 14,
      number: page || 0,
      first: true,
      last: true,
      empty: true,
    };
    
  } catch (error: any) {
    console.error("❌ Erro em getLivros:", error.message);
    
    // Fallback para dados mock
    const mockBooks: Book[] = [
      { isbn: '9788535902775', title: '1984', author: 'George Orwell', availableCopies: 1 },
      { isbn: '9788571640353', title: 'Dom Casmurro', author: 'Machado de Assis', availableCopies: 2 },
      { isbn: '9788544001820', title: 'O Alquimista', author: 'Paulo Coelho', availableCopies: 1 },
    ];
    
    const pageNum = params.page || 0;
    const pageSize = params.size || 14;
    const totalItems = mockBooks.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = pageNum * pageSize;
    const paginatedBooks = mockBooks.slice(startIndex, startIndex + pageSize);
    
    return {
      content: paginatedBooks,
      totalPages: totalPages,
      totalElements: totalItems,
      size: pageSize,
      number: pageNum,
      first: pageNum === 0,
      last: pageNum >= totalPages - 1,
      empty: false,
    };
  }
};