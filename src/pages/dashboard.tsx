import "../styles/global.css";
import Table from "../components/Table/Table";
import LineChartLoans from "../components/LineGraph/LineChartLoans";

const LoanData = [
  { month: "Janeiro", amount: 5000 },
  { month: "Fevereiro", amount: 7000 },
  { month: "Março", amount: 6000 },
  { month: "Abril", amount: 8000 },
  { month: "Maio", amount: 9000 },
  { month: "Junho", amount: 7500 },
  { month: "Julho", amount: 8500 },
];

export default function Dashboard() {
  return (
    <div
      className="dashboard-page"
      style={{
        padding: "10px",
        backgroundColor: "lightblue",
        marginTop: "50px",
      }}
    >
      <h1>🚀 Testando Dashboard</h1>

      {/* Tabela */}
      <Table />

      {/* Gráfico */}
      <LineChartLoans data={LoanData} />
    </div>
  );
}
