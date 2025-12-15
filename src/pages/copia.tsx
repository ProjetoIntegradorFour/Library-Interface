import "../styles/global.css";
import CopyTablePage from "../components/MockedTables/CopyTablePage";
import { useSearchParams } from "react-router-dom";

interface URLState {
  page: number;
  id?: string;
  aluno?: string;
  livro?: string;
  status?: string;
  data?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export default function Copia() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState: URLState = {
    page: parseInt(searchParams.get("page") || "0"),
    id: searchParams.get("id") || undefined,
    aluno: searchParams.get("aluno") || undefined,
    livro: searchParams.get("livro") || undefined,
    status: searchParams.get("status") || undefined,
    data: searchParams.get("data") || undefined,
    sort: searchParams.get("sort") || undefined,
    order: (searchParams.get("order") as "asc" | "desc") || undefined,
  };

  return (
    <div className="archive-page">
      <CopyTablePage
        /* depois você liga paginação, filtros etc */
      />
    </div>
  );
}
