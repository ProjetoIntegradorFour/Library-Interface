import React, { useEffect, useRef, useState, useMemo } from "react";

import plusIcon from "../../assets/img/plus.png";
import trashIcon from "../../assets/img/trash.png";
import editIcon from "../../assets/img/edit.png";

interface Atraso {
  id: number;
  aluno: string;
  livro: string;
  multa: string;
  data: string;
}

interface FilterState {
  id: string;
  aluno: string;
  livro: string;
  multa: string;
  data: string;
}

const DEFAULT_FILTERS: FilterState = {
  id: "",
  aluno: "",
  livro: "",
  multa: "",
  data: "",
};

export default function PaymentTablePage() {
  const [atrasos, setAtrasos] = useState<Atraso[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newAtraso, setNewAtraso] = useState<Omit<Atraso, "id">>({
    aluno: "",
    livro: "",
    multa: "",
    data: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Omit<Atraso, "id">>({
    aluno: "",
    livro: "",
    multa: "",
    data: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 14;

  const filterRef = useRef<HTMLDivElement | null>(null);

  // Carregar dados
  useEffect(() => {
    const stored = localStorage.getItem("atrasos");
    if (stored) {
      setAtrasos(JSON.parse(stored));
    } else {
      setAtrasos([
        { id: 1, aluno: "João Silva", livro: "Dom Casmurro", multa: "R$ 5,00", data: "2024-01-15" },
        { id: 2, aluno: "Maria Santos", livro: "O Cortiço", multa: "R$ 10,00", data: "2024-01-10" },
        { id: 3, aluno: "Pedro Oliveira", livro: "Memórias Póstumas", multa: "R$ 15,50", data: "2024-01-05" },
        { id: 4, aluno: "Ana Costa", livro: "Iracema", multa: "R$ 7,00", data: "2024-01-20" },
        { id: 5, aluno: "Carlos Lima", livro: "O Guarani", multa: "R$ 12,00", data: "2024-01-18" },
      ]);
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("atrasos", JSON.stringify(atrasos));
  }, [atrasos]);

  // Fechar popup de filtro clicando fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filtro com useMemo
  const filteredAtrasos = useMemo(() => {
    return atrasos.filter((a) => {
      if (filters.id && !a.id.toString().includes(filters.id)) return false;
      if (filters.aluno && !a.aluno.toLowerCase().includes(filters.aluno.toLowerCase())) return false;
      if (filters.livro && !a.livro.toLowerCase().includes(filters.livro.toLowerCase())) return false;
      if (filters.multa && !a.multa.toLowerCase().includes(filters.multa.toLowerCase())) return false;
      if (filters.data && !a.data.includes(filters.data)) return false;
      return true;
    });
  }, [atrasos, filters]);

  // Paginação
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAtrasos.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(filteredAtrasos.length / rowsPerPage));

  // Seleção de linhas
  const handleRowSelect = (id: number) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(currentRows.map((r) => r.id));
    else setSelectedRows([]);
  };

  // Abrir modal de adicionar
  const handleAddOpen = () => {
    setNewAtraso({ aluno: "", livro: "", multa: "", data: "" });
    setShowAddModal(true);
  };

  // Salvar novo atraso
  const handleAddConfirm = () => {
    const { aluno, livro, multa, data } = newAtraso;
    if (!aluno || !livro || !multa || !data) return alert("Preencha todos os campos!");

    const newId = atrasos.length ? Math.max(...atrasos.map((a) => a.id)) + 1 : 1;

    setAtrasos((prev) => [...prev, { id: newId, ...newAtraso }]);
    setShowAddModal(false);
  };

  // Deletar selecionados
  const handleDeleteConfirm = () => {
    setAtrasos((prev) => prev.filter((a) => !selectedRows.includes(a.id)));
    setSelectedRows([]);
    setShowDeleteModal(false);
  };

  // Iniciar ou finalizar edição
  const handleEditToggle = () => {
    if (editingId === null) {
      if (selectedRows.length !== 1) return alert("Selecione exatamente uma linha.");
      const id = selectedRows[0];
      const atraso = atrasos.find((a) => a.id === id)!;

      setEditingId(id);
      setEditValues({ aluno: atraso.aluno, livro: atraso.livro, multa: atraso.multa, data: atraso.data });
    } else {
      const { aluno, livro, multa, data } = editValues;
      if (!aluno || !livro || !multa || !data) return alert("Preencha todos os campos!");

      setAtrasos((prev) =>
        prev.map((a) => (a.id === editingId ? { id: a.id, ...editValues } : a))
      );

      setEditingId(null);
      setSelectedRows([]);
    }
  };

  const hasActiveFilters = () => Object.values(filters).some((v) => v !== "");

  return (
    <div className="table-page-container">
      {/* HEADER */}
      <div className="table-header">
        <div className="header-buttons-container">
          <div className="table-controls">
            {/* FILTRO */}
            <div className="filter-container" ref={filterRef}>
              <button
                className={`filter-btn ${hasActiveFilters() ? "active" : ""}`}
                onClick={() => setShowFilter(!showFilter)}
              >
                Filter
                {hasActiveFilters() && <span className="filter-indicator" />}
              </button>

              {showFilter && (
                <div className="filter-popup">
                  <div className="filter-header">
                    <h3>Filtrar por</h3>
                    <button className="close-filter-btn" onClick={() => setShowFilter(false)}>×</button>
                  </div>

                  <div className="filter-fields">
                    {Object.keys(filters).map((key) => (
                      <div className="filter-field" key={key}>
                        <label>{key.toUpperCase()}</label>
                        <input
                          value={(filters as any)[key]}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="filter-actions">
                    <button
                      className="clear-filters-btn"
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTÕES */}
          <div className="table-buttons">
            <button className="add-btn" onClick={handleAddOpen}>
              <img src={plusIcon} className="button-icon" />
            </button>

            <button
              className="delete-btn"
              onClick={() => selectedRows.length && setShowDeleteModal(true)}
            >
              <img src={trashIcon} className="button-icon" />
            </button>

            <button className="edit-btn" onClick={handleEditToggle}>
              <img src={editIcon} className="button-icon" />
            </button>

            {editingId && (
              <button className="cancel-edit-btn" onClick={() => setEditingId(null)}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABELA */}
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
              <th>ALUNO</th>
              <th>LIVRO</th>
              <th>MULTA</th>
              <th>DATA</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row) => (
              <tr key={row.id} className={selectedRows.includes(row.id) ? "selected" : ""}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </td>

                <td>{row.id}</td>

                {["aluno", "livro", "multa", "data"].map((field) => (
                  <td key={field}>
                    {editingId === row.id ? (
                      <input
                        className="inline-edit"
                        value={(editValues as any)[field]}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                      />
                    ) : (
                      (row as any)[field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>◀</button>

        <span>Página {currentPage} de {totalPages}</span>

        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>▶</button>
      </div>
    </div>
  );
}