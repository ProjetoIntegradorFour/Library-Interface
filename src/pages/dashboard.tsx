import "../styles/global.css";
import Table from "../components/Table/Table";
import LineChartLoans from "../components/LineGraph/LineChartLoans";
import Card from "../components/Card/Card";

import warningLogo from "../assets/img/warningLogo.png";
import bookLogo from "../assets/img/bookLogo.png";

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
    >
      {/*Card*/}
      <Card title={"teste"} imageUrl={warningLogo} line1={"teste"} line2={"teste"} line3={"teste"} />
      <Card title={"teste"} imageUrl={bookLogo} line1={"teste"} line2={"teste"} line3={"teste"} />

      {/* Tabela */}
      <Table />

      {/* Gráfico */}
      <LineChartLoans data={LoanData} />
    </div>
  );
}
