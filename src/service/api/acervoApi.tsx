import { apiService } from "../apiService";

// Quando tiver o endpoint real, substitua a string abaixo
const ACERVO_ENDPOINT = "http://localhost:8080/api/collections";

// Função para buscar todos os livros
export const getLivros = async () => {
  return await apiService.get(ACERVO_ENDPOINT);
};

// Função para buscar um livro específico
export const getLivroById = async (id: string) => {
  return await apiService.get(`${ACERVO_ENDPOINT}/${id}`);
};

// Função para adicionar um novo livro
export const addLivro = async (livro: any) => {
  return await apiService.post(ACERVO_ENDPOINT, livro);
};

// Função para atualizar um livro
export const updateLivro = async (id: string, livro: any) => {
  return await apiService.put(`${ACERVO_ENDPOINT}/${id}`, livro);
};

// Função para deletar um livro
export const deleteLivro = async (id: string) => {
  return await apiService.delete(`${ACERVO_ENDPOINT}/${id}`);
};