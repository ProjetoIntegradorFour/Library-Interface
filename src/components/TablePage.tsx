import React, { useEffect, useRef, useState } from "react";

import plusIcon from "../assets/img/plus.png";
import trashIcon from "../assets/img/trash.png";
import editIcon from "../assets/img/edit.png";

interface Book {
  isbn: string;           // ⭐ MANTENHA assim
  title: string;          // ⭐ MANTENHA assim
  author: string;         // ⭐ MANTENHA assim
  cover?: string;         // ⭐ Adicione se a API envia
  availableCopies?: number; // ⭐ Adicione se a API envia
}

// ⭐ ATUALIZE FilterState para refletir os campos reais
interface FilterState {
  isbn: string;      // ⭐ Mude de 'id' para 'isbn'
  title: string;     // ⭐ Mude de 'titulo' para 'title'
  author: string;    // ⭐ Mude de 'autor' para 'author'
  // Remova 'cdd' se não existe na API
}

interface TablePageProps {
  books: Book[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  urlState: any;
  onFilterChange: (filters: any) => void;

  showAddButton?: boolean;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
  showFilterButton?: boolean;
  showSelectionCheckboxes?: boolean;
}

const TablePage: React.FC<TablePageProps> = ({
  books,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  urlState,
  onFilterChange,

  showAddButton = true,
  showDeleteButton = true,
  showEditButton = true,
  showFilterButton = true,
  showSelectionCheckboxes = true
}) => {

    console.log("🚀 [TablePage] Iniciando com:", {
    booksRecebidos: books?.length || 0,
    loading: loading,
    currentPage: currentPage,
    totalPages: totalPages,
    urlState: urlState,
    primeiroLivro: books?.[0],
    filtrosIniciais: {
      isbn: urlState.id || "",
      title: urlState.titulo || "", 
      author: urlState.autor || ""
    }
  });

  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  
  // ⭐ Mude para string[] porque isbn é string
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const [showFilter, setShowFilter] = useState<boolean>(false);

  // ⭐ ATUALIZE os campos do filtro
  const [filters, setFilters] = useState<FilterState>({
    isbn: urlState.id || "",      // ⭐ Mude para isbn
    title: urlState.titulo || "", // ⭐ Mude para title
    author: urlState.autor || "", // ⭐ Mude para author
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // ⭐ ATUALIZE newBook para os campos reais
  const [newBook, setNewBook] = useState<Omit<Book, "isbn">>({
    title: "",      // ⭐ Mude
    author: "",     // ⭐ Mude
    // cover e availableCopies são opcionais
  });

  // ⭐ Mude para string | null
  const [editingIsbn, setEditingIsbn] = useState<string | null>(null);
  
  // ⭐ ATUALIZE editValues
  const [editValues, setEditValues] = useState<Omit<Book, "isbn">>({
    title: "",      // ⭐ Mude
    author: "",     // ⭐ Mude
  });

  const rowsPerPage = 14;
  const filterRef = useRef<HTMLDivElement | null>(null);

  // ➤ Atualiza tabela quando "books" (da API) mudar
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  // ➤ Aplicar filtros - ⭐ ATUALIZE para usar campos corretos
  useEffect(() => {
    let result = books.slice();

    if (filters.isbn) result = result.filter(b => 
      b.isbn.toLowerCase().includes(filters.isbn.toLowerCase())
    );
    if (filters.title) result = result.filter(b => 
      b.title.toLowerCase().includes(filters.title.toLowerCase())
    );
    if (filters.author) result = result.filter(b => 
      b.author.toLowerCase().includes(filters.author.toLowerCase())
    );

    setFilteredBooks(result);
    onFilterChange(filters);
  }, [filters, books]);

  // ➤ Paginação
  const indexOfFirstRow = currentPage * rowsPerPage; // 0 * 14 = 0
  const indexOfLastRow = indexOfFirstRow + rowsPerPage; // 0 + 14 = 14
  const currentRows = filteredBooks.slice(indexOfFirstRow, indexOfLastRow);

  console.log("🔢 [TablePage] Cálculo paginação:", {
  currentPage: currentPage,
  rowsPerPage: rowsPerPage,
  indexOfFirstRow: indexOfFirstRow,
  indexOfLastRow: indexOfLastRow,
  filteredBooksCount: filteredBooks.length,
  currentRowsCount: currentRows.length,
  sliceResult: `slice(${indexOfFirstRow}, ${indexOfLastRow})`
  });

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

  // Seleção individual - ⭐ ATUALIZE para usar isbn (string)
  const handleRowSelect = (isbn: string) => {
    setSelectedRows(prev => 
      prev.includes(isbn) ? prev.filter(x => x !== isbn) : [...prev, isbn]
    );
  };

  // Seleção total - ⭐ ATUALIZE para usar isbn
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(currentRows.map(r => r.isbn));
    else setSelectedRows([]);
  };

  // ➤ Criar (Só visual no front) - ⭐ ATUALIZE campos
  const handleAddOpen = () => {
    setNewBook({ title: "", author: "" });
    setShowAddModal(true);
  };

  const handleAddConfirm = () => {
    if (!newBook.title.trim() || !newBook.author.trim()) {
      alert("Preencha Título e Autor.");
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

  // ➤ Editar (somente no front) - ⭐ ATUALIZE para usar isbn
  const handleEditToggle = () => {
    if (editingIsbn === null) {
      if (selectedRows.length !== 1) {
        alert("Selecione exatamente uma linha para editar.");
        return;
      }
      const isbn = selectedRows[0];
      const book = filteredBooks.find(b => b.isbn === isbn)!;
      setEditingIsbn(isbn);
      setEditValues({ title: book.title, author: book.author });
    } else {
      alert("Esse front não salva edição na API. Apenas visual.");
      setEditingIsbn(null);
      setEditValues({ title: "", author: "" });
      setSelectedRows([]);
    }
  };

  const handleEditCancel = () => {
    setEditingIsbn(null);
    setEditValues({ title: "", author: "" });
    setSelectedRows([]);
  };

  const clearFilters = () => {
    setFilters({ isbn: "", title: "", author: "" });
  };

  const hasActiveFilters = () =>
    filters.isbn || filters.title || filters.author;

  // ⭐ ADICIONE ESTE DEBUG
  console.log("🔍 TablePage DEBUG:", {
    booksCount: books.length,
    filteredCount: filteredBooks.length,
    currentRowsCount: currentRows.length,
    firstBook: books[0],
    selectedRows,
    filters
  });

  return (
    <div className="table-page-container">

      {/* Cabeçalho */}
      <div className="table-header">
        <div className="header-buttons-container">

          {/* Filtros - ⭐ ATUALIZE campos */}
          {showFilterButton &&(
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
                    {/* ⭐ ATUALIZE campos do filtro */}
                    <div className="filter-field">
                      <label>ISBN</label>
                      <input
                        value={filters.isbn}
                        onChange={(e) => setFilters(prev => ({ ...prev, isbn: e.target.value }))}
                        placeholder="Filtrar por ISBN"
                      />
                    </div>
                    <div className="filter-field">
                      <label>Título</label>
                      <input
                        value={filters.title}
                        onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Filtrar por título"
                      />
                    </div>
                    <div className="filter-field">
                      <label>Autor</label>
                      <input
                        value={filters.author}
                        onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
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
          )}

          {/* Botões */}
          <div className="table-buttons">
            { showAddButton && (
            <button className="add-btn" onClick={handleAddOpen}>
              <img src={plusIcon} alt="Adicionar" className="button-icon" />
            </button>
            )}

            { showDeleteButton && (
            <button className="delete-btn" onClick={handleDeleteOpen}>
              <img src={trashIcon} alt="Deletar" className="button-icon" />
            </button>
            )}

            { showEditButton && (
            <button className="edit-btn" onClick={handleEditToggle}>
              <img src={editIcon} alt="Editar" className="button-icon" />
            </button>
            )}

            {editingIsbn !== null && (
              <button className="cancel-edit-btn" onClick={handleEditCancel}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabela - ⭐ ATUALIZE cabeçalhos e dados */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              {showSelectionCheckboxes && (
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === currentRows.length && currentRows.length > 0}
                />
              </th>
              )}
              <th>ISBN</th> {/* ⭐ Mude de ID para ISBN */}
              <th>TÍTULO</th>
              <th>AUTOR</th>
              {/* ⭐ Remova CDD se não existe */}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}> {/* ⭐ Ajuste colSpan */}
                  Carregando...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}> {/* ⭐ Ajuste colSpan */}
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              currentRows.map((book) => (
                <tr 
                  key={book.isbn} 
                  className={selectedRows.includes(book.isbn) ? "selected" : ""}
                >
                  {showSelectionCheckboxes && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(book.isbn)}
                      onChange={() => handleRowSelect(book.isbn)}
                    />
                  </td>
                  )}

                  {/* ⭐ USE OS CAMPOS CORRETOS */}
                  <td>{book.isbn}</td>

                  <td>
                    {editingIsbn === book.isbn ? (
                      <input
                        className="inline-edit"
                        value={editValues.title}
                        onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                      />
                    ) : (
                      book.title
                    )}
                  </td>

                  <td>
                    {editingIsbn === book.isbn ? (
                      <input
                        className="inline-edit"
                        value={editValues.author}
                        onChange={(e) => setEditValues(prev => ({ ...prev, author: e.target.value }))}
                      />
                    ) : (
                      book.author
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
        {/* ⭐ CORREÇÃO: Mostre currentPage + 1 para o usuário */}
        <span>Página {currentPage + 1} de {totalPages}</span>

        {/* ⭐ CORREÇÃO: 0 em vez de 1 */}
        <button
          disabled={currentPage === 0}
          onClick={() => {
            console.log("⬅️ Indo para página:", currentPage - 1);
            onPageChange(currentPage - 1);
          }}
        >
          Anterior
        </button>

        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => {
            console.log("➡️ Indo para página:", currentPage + 1);
            onPageChange(currentPage + 1);
          }}
        >
          Próxima
        </button>
      </div>

      {/* Modal Add - ⭐ ATUALIZE campos */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">Adicionar Novo Livro</div>

            <div className="modal-body">
              <div className="modal-field">
                <label>Título</label> {/* ⭐ Mude */}
                <input
                  value={newBook.title}
                  onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="modal-field">
                <label>Autor</label> {/* ⭐ Mude */}
                <input
                  value={newBook.author}
                  onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
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