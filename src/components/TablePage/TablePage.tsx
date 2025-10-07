import React, { useState, useEffect, useRef } from "react";
import "./TablePage.css";

import plusIcon from "../../assets/img/plus.png";
import trashIcon from "../../assets/img/trash.png";

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

const initialBooks: Book[] = [
  { id: 1, cdd: "020", titulo: "Introdução à Biblioteconomia", autor: "Maria Souza" },
  { id: 2, cdd: "510", titulo: "Fundamentos de Álgebra", autor: "João Pereira" },
  { id: 3, cdd: "820", titulo: "Contos Modernos", autor: "Ana Lima" },
  { id: 4, cdd: "460", titulo: "Redes de Computadores", autor: "Carlos Mendes" },
  { id: 5, cdd: "370", titulo: "Educação e Sociedade", autor: "Fernanda Alves" },
  { id: 6, cdd: "610", titulo: "Anatomia Humana", autor: "Ricardo Oliveira" },
  { id: 7, cdd: "330", titulo: "Economia Global", autor: "Beatriz Santos" },
  { id: 8, cdd: "540", titulo: "Química Experimental", autor: "Paulo Fernandes" },
  { id: 9, cdd: "910", titulo: "Atlas Geográfico", autor: "Júlia Martins" },
  { id: 10, cdd: "621", titulo: "Eletrônica Aplicada", autor: "Marcelo Costa" },
  { id: 11, cdd: "150", titulo: "Psicologia Cognitiva", autor: "Camila Rocha" },
  { id: 12, cdd: "700", titulo: "História da Arte", autor: "Rodrigo Moreira" },
  { id: 13, cdd: "780", titulo: "Teoria Musical", autor: "Patrícia Nogueira" },
  { id: 14, cdd: "300", titulo: "Introdução às Ciências Sociais", autor: "Felipe Azevedo" },
  { id: 15, cdd: "520", titulo: "Astronomia Básica", autor: "Larissa Carvalho" },
  { id: 16, cdd: "860", titulo: "Poesia Brasileira Contemporânea", autor: "Thiago Barros" },
];

const TablePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    id: "",
    cdd: "",
    titulo: "",
    autor: ""
  });

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 14;

  const filterRef = useRef<HTMLDivElement>(null);

  // Fechar o pop-up de filtro ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Aplicar filtros e pesquisa
  useEffect(() => {
    let result = initialBooks;
    
    if (filters.id) {
      result = result.filter(book => book.id.toString().includes(filters.id));
    }
    if (filters.cdd) {
      result = result.filter(book => book.cdd.includes(filters.cdd));
    }
    if (filters.titulo) {
      result = result.filter(book => 
        book.titulo.toLowerCase().includes(filters.titulo.toLowerCase()));
    }
    if (filters.autor) {
      result = result.filter(book => 
        book.autor.toLowerCase().includes(filters.autor.toLowerCase()));
    }
    
    if (searchTerm) {
      result = result.filter(book => 
        book.id.toString().includes(searchTerm) ||
        book.cdd.includes(searchTerm) ||
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBooks(result);
    setCurrentPage(1); // resetar para primeira página ao aplicar filtro
  }, [searchTerm, filters]);

  // Paginação: calcular índices
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBooks.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(e.currentTarget.value);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRowSelect = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(currentRows.map(book => book.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleAddRow = () => {
    const newId = books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
    const newBook: Book = {
      id: newId,
      cdd: "",
      titulo: "",
      autor: ""
    };
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
  };

  const handleDeleteRows = () => {
    if (selectedRows.length === 0) return;
    
    const updatedBooks = books.filter(book => !selectedRows.includes(book.id));
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    setSelectedRows([]);
  };

  const clearFilters = () => {
    setFilters({
      id: "",
      cdd: "",
      titulo: "",
      autor: ""
    });
    setSearchTerm("");
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <div className="header-buttons-container">
          <div className="table-controls">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Procura" 
                onKeyDown={handleSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-container" ref={filterRef}>
              <button onClick={() => setShowFilter(!showFilter)}>Filter</button>
              {showFilter && (
                <div className="filter-popup">
                  <div className="filter-header">
                    <h3>Filtrar por</h3>
                    <button onClick={() => setShowFilter(false)}>X</button>
                  </div>
                  <div className="filter-fields">
                    <div className="filter-field">
                      <label>ID</label>
                      <input 
                        type="text" 
                        value={filters.id}
                        onChange={(e) => handleFilterChange('id', e.target.value)}
                      />
                    </div>
                    <div className="filter-field">
                      <label>CDD / CDU</label>
                      <input 
                        type="text" 
                        value={filters.cdd}
                        onChange={(e) => handleFilterChange('cdd', e.target.value)}
                      />
                    </div>
                    <div className="filter-field">
                      <label>Título</label>
                      <input 
                        type="text" 
                        value={filters.titulo}
                        onChange={(e) => handleFilterChange('titulo', e.target.value)}
                      />
                    </div>
                    <div className="filter-field">
                      <label>Autor</label>
                      <input 
                        type="text" 
                        value={filters.autor}
                        onChange={(e) => handleFilterChange('autor', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="filter-actions">
                    <button onClick={clearFilters}>Limpar Filtros</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="table-buttons">
            <button className="add-btn" onClick={handleAddRow}>
              <img src={plusIcon} alt="Adicionar" className="button-icon" />
            </button>
            <button className="delete-btn" onClick={handleDeleteRows}>
              <img src={trashIcon} alt="Deletar" className="button-icon" />
            </button>
          </div>
        </div>
      </div>

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
            {currentRows.map((book) => (
              <tr 
                key={book.id} 
                className={selectedRows.includes(book.id) ? 'selected' : ''}
              >
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedRows.includes(book.id)}
                    onChange={() => handleRowSelect(book.id)}
                  />
                </td>
                <td>{book.id}</td>
                <td>{book.cdd}</td>
                <td>{book.titulo}</td>
                <td>{book.autor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      <div className="pagination">
        <span>Página {currentPage} de {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default TablePage;
