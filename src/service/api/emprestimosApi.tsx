import { apiService } from "../apiService";
import type { Loan, PaginatedResponse } from "../../types/loan";

const EMPRESTIMOS_ENDPOINT = "/loans";

interface GetEmprestimosParams {
    page: number;
    size?: number;
    id?: string;
    userName?: string;
    bookName?: string;
    status?: string;
    dataLoan?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

export const getEmprestimos = async (params: GetEmprestimosParams): Promise<PaginatedResponse<Loan>> => {
    const { page, size = 14, ...filters } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...filters
    });

    return await apiService.get(`${EMPRESTIMOS_ENDPOINT}?${queryParams}`);
};