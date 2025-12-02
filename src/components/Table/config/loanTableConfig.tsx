import type { TableColumn } from "../types";
import type { Loan } from "../../../types/loan";

export const loanColumns: TableColumn<Loan>[] = [
    {
        key: "id",
        header: "ID",
        render: (loan) => loan.id,
        sortable: true,
        filterable: true
    },
    {
        key: "userName",
        header: "USUÁRIO",
        render: (loan) => loan.userName,
        sortable: true,
        filterable: true
    },
    {
        key: "bookName",
        header: "LIVRO",
        render: (loan) => loan.bookName,
        sortable: true,
        filterable: true
    },
    {
        key: "status",
        header: "STATUS",
        render: (loan) => loan.status,
        sortable: true,
        filterable: true
    },
    {
        key: "dataLoan",
        header: "DATA DO EMPRÉSTIMO",
        render: (loan) => loan.dataLoan,
        sortable: true,
        filterable: true
    }
];

export const loanTableConfig = {
    selectable: true,
    pagination: true,
    sortable: true,
    filterable: true
};