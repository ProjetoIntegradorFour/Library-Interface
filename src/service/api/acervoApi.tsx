import { apiService } from "../apiService";
import type { Book, PaginatedResponse } from "../../types/book";

const ACERVO_ENDPOINT = "/collections";

interface GetLivrosParams {
  page: number;
  size?: number;

  // novos filtros
  isbn?: string;
  title?: string;
  author?: string;
  cover?: string;
  availableCopies?: number;

  // já existentes
  sort?: string;
  order?: "asc" | "desc";
}

export const getLivros = async (
  params: GetLivrosParams
): Promise<PaginatedResponse<Book>> => {
  const { page, size = 14, ...filters } = params;

  // remove undefined do objeto antes de enviar
  const sanitizedFilters: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      sanitizedFilters[key] = String(value);
    }
  });

  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    ...sanitizedFilters
  });

  return await apiService.get(`${ACERVO_ENDPOINT}?${queryParams.toString()}`);
};