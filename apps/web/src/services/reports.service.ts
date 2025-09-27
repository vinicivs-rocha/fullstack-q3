import { inject, injectable } from "inversify";
import { Axios } from "axios";
import { TYPES } from "@/lib/di-types";
import {
  BrandsInvoiceCount,
  InvoicesAggregationStats,
  InvoicesDailyCount,
  InvoicesStatusCount,
  ProblemsIncidenceRate,
  ReportsFilters,
  SurveyorsInvoiceAggregationStats,
} from "@fullstack-q3/contracts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

@injectable()
export class ReportsService {
  constructor(@inject(TYPES.Axios) private httpClient: Axios) {}

  async getInvoicesStats(
    filters: ReportsFilters,
  ): Promise<InvoicesAggregationStats> {
    const response = await this.httpClient.get("/reports/invoices-stats", {
      params: filters,
    });
    return response.data;
  }

  async getInvoicesDailyCount(
    filters: ReportsFilters,
  ): Promise<InvoicesDailyCount> {
    const response = await this.httpClient.get(
      "/reports/invoices-daily-count",
      { params: filters },
    );
    return response.data;
  }

  async getInvoicesStatusCount(
    filters: ReportsFilters,
  ): Promise<InvoicesStatusCount> {
    const response = await this.httpClient.get(
      "/reports/invoices-status-count",
      { params: filters },
    );
    return response.data;
  }

  async getSurveyorsInvoiceAggregationStats(
    filters: ReportsFilters,
  ): Promise<SurveyorsInvoiceAggregationStats> {
    const response = await this.httpClient.get(
      "/reports/surveyors-invoice-aggregation-stats",
      { params: filters },
    );
    return response.data;
  }

  async getProblemsIncidenceRate(
    filters: ReportsFilters,
  ): Promise<ProblemsIncidenceRate> {
    const response = await this.httpClient.get(
      "/reports/problems-incidence-rate",
      { params: filters },
    );
    return response.data;
  }

  async getBrandsInvoiceCount(
    filters: ReportsFilters,
  ): Promise<BrandsInvoiceCount> {
    const response = await this.httpClient.get(
      "/reports/brands-invoice-count",
      { params: filters },
    );
    return response.data;
  }

  async export(
    report: HTMLDivElement,
    start: string,
    end: string,
    surveyorId: number | undefined,
  ): Promise<void> {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const canvas = await html2canvas(report, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      backgroundColor: "white",
      height: report.scrollHeight,
      width: report.scrollWidth,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(
      `relatorio_${start}_${end}_${surveyorId ? `_${surveyorId}` : ""}.pdf`,
    );
  }
}
