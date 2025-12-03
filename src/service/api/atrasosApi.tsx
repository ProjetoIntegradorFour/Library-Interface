import { apiService } from "../apiService";
import type { Payment, PaginatedResponse } from "../../types/payment";

const ATRASOS_ENDPOINT = "/payments/overdue";

interface GetAtrasosParams {
    page: number;
    size?: number;
    id?: string;
    userName?: string;
    bookTitle?: string;
    fineAmount?: string;
    dueDate?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

export const getAtrasos = async (params: GetAtrasosParams): Promise<PaginatedResponse<Payment>> => {
    const { page, size = 14, ...filters } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...filters
    });

    return await apiService.get(`${ATRASOS_ENDPOINT}?${queryParams}`);
};