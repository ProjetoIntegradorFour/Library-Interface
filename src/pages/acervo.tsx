import "../styles/global.css";
import TablePage from "../components/TablePage";
import { useEffect, useState } from "react";
import { getLivros } from "../service/api/acervoApi";
import type { Book } from "../types/book";
import { useSearchParams } from "react-router-dom";

// Define ALL possible URL parameters
interface URLState {
  page: number;
  // Future filters - already in place!
  id?: string;
  cdd?: string;
  titulo?: string;
  autor?: string;
  // Future sorting
  sort?: string;
  order?: 'asc' | 'desc';
}

export default function Acervo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Parse ALL URL parameters - ⭐ GARANTE que page seja não-negativo
  const urlState: URLState = {
    page: Math.max(0, parseInt(searchParams.get('page') || '0')), // ⭐ Math.max para evitar negativo
    id: searchParams.get('id') || undefined,
    cdd: searchParams.get('cdd') || undefined,
    titulo: searchParams.get('titulo') || undefined,
    autor: searchParams.get('autor') || undefined,
    sort: searchParams.get('sort') || undefined,
    order: (searchParams.get('order') as 'asc' | 'desc') || undefined
  };

  useEffect(() => {
    const fetchLivros = async () => {
      console.log("🔄 [Acervo] Buscando livros...");
      console.log("📖 Página solicitada:", urlState.page);
      
      setLoading(true);
      setError(null);

      try {
        // ⭐ PASSE o tamanho da página explicitamente
        const response = await getLivros({
          page: urlState.page,
          size: 14, // ⭐ IMPORTANTE: Mesmo valor do TablePage
        });
        
        console.log("✅ [Acervo] Dados recebidos:", {
          livrosEncontrados: response.content.length,
          paginaAPI: response.number,
          totalPaginasAPI: response.totalPages,
          primeiroLivro: response.content[0]
        });

        // ⭐ VALIDAÇÃO: Se a página for maior que o total, ajusta
        if (urlState.page >= response.totalPages && response.totalPages > 0) {
          console.log("⚠️ Página inválida, redirecionando para página 0");
          updateURLState({ page: 0 });
          return;
        }

        setBooks(response.content);
        setTotalPages(Math.max(1, response.totalPages)); // ⭐ Mínimo 1 página
        
      } catch (error: any) {
        console.error("❌ [Acervo] Erro:", error);
        setError("Erro ao carregar acervo: " + error.message);
        setBooks([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, [urlState.page]);

  const handlePageChange = (newPage: number) => {
    // ⭐ GARANTE que newPage não seja negativo
    const safePage = Math.max(0, newPage);
    console.log("📖 [Acervo] Mudando para página:", safePage);
    updateURLState({ page: safePage });
  };

  // FUTURE: Handle filter changes
  const handleFilterChange = (filters: Partial<URLState>) => {
    updateURLState({ ...filters, page: 0 });
  };

  // UNIVERSAL URL updater
  const updateURLState = (updates: Partial<URLState>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  // ⭐ DEBUG: Mostre o estado atual
  console.log("🎯 [Acervo] Renderizando com:", {
    booksCount: books.length,
    loading: loading,
    currentPage: urlState.page,
    totalPages: totalPages,
    error: error,
    primeiroLivro: books[0]
  });

  return (
    <div className="archive-page">
      {/* ⭐ MENSAGEM DE ERRO */}
      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#c00'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ⭐ TABLE PAGE */}
      <TablePage
        books={books}
        loading={loading}
        currentPage={urlState.page} // ⭐ CORRETO: zero-based (0, 1, 2...)
        totalPages={totalPages}
        onPageChange={handlePageChange}
        urlState={urlState}
        onFilterChange={handleFilterChange}
        showAddButton={false}
        showDeleteButton={false}
        showEditButton={false}
        showFilterButton={false}
        showSelectionCheckboxes={false}
      />
    </div>
  );
}