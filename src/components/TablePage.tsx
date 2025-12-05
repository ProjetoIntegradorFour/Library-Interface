import React, { useEffect, useRef, useState } from "react";

import plusIcon from "../assets/img/plus.png";
import trashIcon from "../assets/img/trash.png";
import editIcon from "../assets/img/edit.png";

interface Book {
  id: number;
  cdd: string;
  titulo: string;
  autor: string;
}

interface FilterState {
  id: string;
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
  urlState: any;
  onFilterChange: (filters: any) => void;
}

const TablePage: React.FC<TablePageProps> = ({
  books,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  urlState,
  onFilterChange
}) => {

  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    id: urlState.id || "",
    cdd: urlState.cdd || "",
    titulo: urlState.titulo || "",
    autor: urlState.autor || ""
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    cdd: "",
    titulo: "",
    autor: ""
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Omit<Book, "id">>({
    cdd: "",
    titulo: "",
    autor: ""
  });

  const rowsPerPage = 14;
  const filterRef = useRef<HTMLDivElement | null>(null);

  // ➤ Atualiza tabela quando "books" (da API) mudar
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  // ➤ Aplicar filtros
  useEffect(() => {
    let result = books.slice();

    if (filters.id) result = result.filter(b => b.id.toString().includes(filters.id));
    if (filters.cdd) result = result.filter(b => b.cdd.toLowerCase().includes(filters.cdd.toLowerCase()));
    if (filters.titulo) result = result.filter(b => b.titulo.toLowerCase().includes(filters.titulo.toLowerCase()));
    if (filters.autor) result = result.filter(b => b.autor.toLowerCase().includes(filters.autor.toLowerCase()));

    setFilteredBooks(result);
    onFilterChange(filters);
  }, [filters, books]);

  // ➤ Paginação
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBooks.slice(indexOfFirstRow, indexOfLastRow);

  // ➤ Fechar popup ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Seleção individual
  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Seleção total
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(currentRows.map(r => r.id));
    else setSelectedRows([]);
  };

  // ➤ Criar (Só visual no front)
  const handleAddOpen = () => {
    setNewBook({ cdd: "", titulo: "", autor: "" });
    setShowAddModal(true);
  };

  const handleAddConfirm = () => {
    if (!newBook.cdd.trim() || !newBook.titulo.trim() || !newBook.autor.trim()) {
      alert("Preencha CDD, Título e Autor.");
      return;
    }

    alert("Esse front não adiciona na API. Apenas exemplo visual.");
    setShowAddModal(false);
  };

  const handleAddCancel = () => setShowAddModal(false);

  // ➤ Deletar (somente visual)
  const handleDeleteOpen = () => {
    if (selectedRows.length === 0) {
      alert("Selecione ao menos uma linha para deletar.");
      return;
    }
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    alert("Esse front não deleta na API. A tabela é carregada da API sempre.");
    setSelectedRows([]);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => setShowDeleteModal(false);

  // ➤ Editar (somente no front)
  const handleEditToggle = () => {
    if (editingId === null) {
      if (selectedRows.length !== 1) {
        alert("Selecione exatamente uma linha para editar.");
        return;
      }
      const id = selectedRows[0];
      const book = filteredBooks.find(b => b.id === id)!;
      setEditingId(id);
      setEditValues({ cdd: book.cdd, titulo: book.titulo, autor: book.autor });
    } else {
      alert("Esse front não salva edição na API. Apenas visual.");
      setEditingId(null);
      setEditValues({ cdd: "", titulo: "", autor: "" });
      setSelectedRows([]);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({ cdd: "", titulo: "", autor: "" });
    setSelectedRows([]);
  };

  const clearFilters = () => {
    setFilters({ id: "", cdd: "", titulo: "", autor: "" });
  };

  const hasActiveFilters = () =>
    filters.id || filters.cdd || filters.titulo || filters.autor;

  return (
    <div className="table-page-container">

      {/* Cabeçalho */}
      <div className="table-header">
        <div className="header-buttons-container">

          {/* Filtros */}
          <div className="table-controls">
            <div className="filter-container" ref={filterRef}>
              <button
                className={`filter-btn ${hasActiveFilters() ? "active" : ""}`}
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
                    <div className="filter-field">
                      <label>ID</label>
                      <input
                        value={filters.id}
                        onChange={(e) => setFilters(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="Filtrar por ID"
                      />
                    </div>
                    <div className="filter-field">
                      <label>CDD / CDU</label>
                      <input
                        value={filters.cdd}
                        onChange={(e) => setFilters(prev => ({ ...prev, cdd: e.target.value }))}
                        placeholder="Filtrar por CDD"
                      />
                    </div>
                    <div className="filter-field">
                      <label>Título</label>
                      <input
                        value={filters.titulo}
                        onChange={(e) => setFilters(prev => ({ ...prev, titulo: e.target.value }))}
                        placeholder="Filtrar por título"
                      />
                    </div>
                    <div className="filter-field">
                      <label>Autor</label>
                      <input
                        value={filters.autor}
                        onChange={(e) => setFilters(prev => ({ ...prev, autor: e.target.value }))}
                        placeholder="Filtrar por autor"
                      />
                    </div>
                  </div>

                  <div className="filter-actions">
                    <button className="clear-filters-btn" onClick={clearFilters}>Limpar Filtros</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="table-buttons">
            <button className="add-btn" onClick={handleAddOpen}>
              <img src={plusIcon} alt="Adicionar" className="button-icon" />
            </button>

            <button className="delete-btn" onClick={handleDeleteOpen}>
              <img src={trashIcon} alt="Deletar" className="button-icon" />
            </button>

            <button className="edit-btn" onClick={handleEditToggle}>
              <img src={editIcon} alt="Editar" className="button-icon" />
            </button>

            {editingId !== null && (
              <button className="cancel-edit-btn" onClick={handleEditCancel}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === currentRows.length && currentRows.length > 0}
                />
              </th>
              <th>ID</th>
              <th>CDD / CDU</th>
              <th>TÍTULO</th>
              <th>AUTOR</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              currentRows.map((book) => (
                <tr key={book.id} className={selectedRows.includes(book.id) ? "selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(book.id)}
                      onChange={() => handleRowSelect(book.id)}
                    />
                  </td>

                  <td>{book.id}</td>

                  <td>
                    {editingId === book.id ? (
                      <input
                        className="inline-edit"
                        value={editValues.cdd}
                        onChange={(e) => setEditValues(prev => ({ ...prev, cdd: e.target.value }))}
                      />
                    ) : (
                      book.cdd
                    )}
                  </td>

                  <td>
                    {editingId === book.id ? (
                      <input
                        className="inline-edit"
                        value={editValues.titulo}
                        onChange={(e) => setEditValues(prev => ({ ...prev, titulo: e.target.value }))}
                      />
                    ) : (
                      book.titulo
                    )}
                  </td>

                  <td>
                    {editingId === book.id ? (
                      <input
                        className="inline-edit"
                        value={editValues.autor}
                        onChange={(e) => setEditValues(prev => ({ ...prev, autor: e.target.value }))}
                      />
                    ) : (
                      book.autor
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="pagination">
        <span>Página {currentPage} de {totalPages}</span>

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </button>
      </div>

      {/* Modal Add */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">Adicionar Novo Livro</div>

            <div className="modal-body">
              <div className="modal-field">
                <label>CDD / CDU</label>
                <input
                  value={newBook.cdd}
                  onChange={(e) => setNewBook(prev => ({ ...prev, cdd: e.target.value }))}
                />
              </div>

              <div className="modal-field">
                <label>Título</label>
                <input
                  value={newBook.titulo}
                  onChange={(e) => setNewBook(prev => ({ ...prev, titulo: e.target.value }))}
                />
              </div>

              <div className="modal-field">
                <label>Autor</label>
                <input
                  value={newBook.autor}
                  onChange={(e) => setNewBook(prev => ({ ...prev, autor: e.target.value }))}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleAddCancel}>Cancelar</button>
              <button className="confirm-btn" onClick={handleAddConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">Confirmar exclusão</div>

            <div className="modal-body">
              <p>Deseja realmente excluir {selectedRows.length} registro(s)?</p>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleDeleteCancel}>Cancelar</button>
              <button className="confirm-btn delete-confirm-btn" onClick={handleDeleteConfirm}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePage;