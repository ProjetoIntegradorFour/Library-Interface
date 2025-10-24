import "../styles/global.css";
import TablePage from "../components/TablePage/TablePage";
import { useEffect, useState } from "react";
import { getLivros } from "../service/api/acervoApi";

export default function Acervo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const data = await getLivros();
        // ✅ Salva no localStorage para o TablePage ler
        localStorage.setItem("books", JSON.stringify(data));
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  if (loading) return <p>Carregando livros...</p>;

  return (
    <div className="archive-page">
      <TablePage />
    </div>
  );
}