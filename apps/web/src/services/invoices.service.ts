import { TYPES } from "@/lib/di-types";
import {
    InvoicesFilters,
    InvoicesListResponse,
    InvoicesStats
} from "@fullstack-q3/contracts";
import { Axios } from "axios";
import { inject, injectable } from "inversify";

@injectable()
export class InvoiceService {
    constructor(
        @inject(TYPES.Axios) private httpClient: Axios,
    ) {}

    async list(filters: InvoicesFilters): Promise<InvoicesListResponse> {
        const response = await this.httpClient.get('/invoices', { params: filters });
        return response.data;
    }

    async stats(filters: InvoicesFilters): Promise<InvoicesStats> {
        const response = await this.httpClient.get('/invoices/stats', { params: filters });
        return response.data;
    }
}
