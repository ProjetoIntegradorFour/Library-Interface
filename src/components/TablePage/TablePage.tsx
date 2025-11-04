import React, { useEffect, useRef, useState } from "react";

interface Book {
  id: number;
  cdd: string;
  titulo: string;
  autor: string;
}

interface TablePageProps {
  books: Book[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface FilterState {
  id: string;
  cdd: string;
  titulo: string;
  autor: string;
}

const TablePage: React.FC<TablePageProps> = ({ 
  books, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({ id: "", cdd: "", titulo: "", autor: "" });

  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("[TablePage] Recebendo livros:", books.length);
    setFilteredBooks(books);
  }, [books]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let result = books.slice();
    if (filters.id) result = result.filter(b => b.id.toString().includes(filters.id));
    if (filters.cdd) result = result.filter(b => b.cdd.toLowerCase().includes(filters.cdd.toLowerCase()));
    if (filters.titulo) result = result.filter(b => b.titulo.toLowerCase().includes(filters.titulo.toLowerCase()));
    if (filters.autor) result = result.filter(b => b.autor.toLowerCase().includes(filters.autor.toLowerCase()));

    console.log("[TablePage] Filtros aplicados:", filters);
    setFilteredBooks(result);
    if (currentPage !== 0) {
      onPageChange(0);
    }
  }, [books, filters]);

  const currentRows = filteredBooks;

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(currentRows.map(r => r.id));
    else setSelectedRows([]);
  };

  const clearFilters = () => setFilters({ id: "", cdd: "", titulo: "", autor: "" });
  const hasActiveFilters = () => Object.values(filters).some(f => f !== "");

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <div className="header-buttons-container">
          <div className="table-controls">
            <div className="filter-container" ref={filterRef}>
              <button
                className={`filter-btn ${hasActiveFilters() ? 'active' : ''}`}
                onClick={() => setShowFilter(!showFilter)}
              >
                Filter
                {hasActiveFilters() && <span className="filter-indicator"></span>}
              </button>
              {showFilter && (
                <div className="filter-popup">
                  <div className="filter-header">
                    <h3>Filtrar por</h3>
                    <button className="close-filter-btn" onClick={() => setShowFilter(false)}>×</button>
                  </div>
                  <div className="filter-fields">
                    {["id", "cdd", "titulo", "autor"].map((key) => (
                      <div className="filter-field" key={key}>
                        <label>{key.toUpperCase()}</label>
                        <input
                          type="text"
                          value={(filters as any)[key]}
                          onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={`Filtrar por ${key}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="filter-actions">
                    <button className="clear-filters-btn" onClick={clearFilters}>Limpar Filtros</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === currentRows.length && currentRows.length > 0} /></th>
              <th>ID</th>
              <th>CDD / CDU</th>
              <th>TÍTULO</th>
              <th>AUTOR</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "18px 0" }}>Carregando livros...</td></tr>
            ) : currentRows.length > 0 ? (
              currentRows.map((book) => (
                <tr key={book.id} className={selectedRows.includes(book.id) ? "selected" : ""}>
                  <td><input type="checkbox" checked={selectedRows.includes(book.id)} onChange={() => handleRowSelect(book.id)} /></td>
                  <td>{book.id}</td>
                  <td>{book.cdd}</td>
                  <td>{book.titulo}</td>
                  <td>{book.autor}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "18px 0" }}>Nenhum registro</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>Página {currentPage + 1} de {totalPages}</span>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>Próxima</button>
      </div>
    </div>
  );
};

export default TablePage;