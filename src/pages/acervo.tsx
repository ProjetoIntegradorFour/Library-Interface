import "../styles/global.css";
import TablePage from "../components/TablePage/TablePage";
import { useEffect, useState } from "react";
import { getLivros } from "../service/api/acervoApi";
import type { Book } from "../types/book";

export default function Acervo() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchLivros = async () => {
      console.log("[Acervo] Buscando livros página:", currentPage);
      try {
        const response = await getLivros(currentPage);
        console.log("[Acervo] Resposta paginada:", response);
        setBooks(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("[Acervo] Erro ao carregar livros:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="archive-page">
      <TablePage
        books={books}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}