import { apiService } from "../apiService";
import type { Book, PaginatedResponse } from "../../types/book";

const ACERVO_ENDPOINT = "/collections";

export const getLivros = async (page: number = 0, size: number = 14): Promise<PaginatedResponse<Book>> => {
  return await apiService.get(`${ACERVO_ENDPOINT}?page=${page}&size=${size}`);
};