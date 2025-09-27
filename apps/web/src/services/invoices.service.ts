import { TYPES } from "@/lib/di-types";
import {
  DetailedInvoiceResponse,
  InvoicesFilters,
  InvoicesStatsResponse,
  InvoicesListResponse,
  InvoiceCreationData,
  InvoiceUpdateData,
} from "@fullstack-q3/contracts";
import { Axios } from "axios";
import { inject, injectable } from "inversify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { InvoiceDetailingModalRef } from "@/components/invoice-detailing-modal";

@injectable()
export class InvoiceService {
  constructor(@inject(TYPES.Axios) private httpClient: Axios) {}

  async list(filters: InvoicesFilters): Promise<InvoicesListResponse> {
    const response = await this.httpClient.get("/invoices", {
      params: filters,
    });
    return response.data;
  }

  async stats(filters: InvoicesFilters): Promise<InvoicesStatsResponse> {
    const response = await this.httpClient.get("/invoices/stats", {
      params: filters,
    });
    return response.data;
  }

  async detail(id: number): Promise<DetailedInvoiceResponse> {
    const response = await this.httpClient.get(`/invoices/${id}`);
    return response.data;
  }

  async export(
    details: InvoiceDetailingModalRef,
    vehiclePlate: string | undefined,
    invoiceId: number | undefined,
  ): Promise<void> {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    await details.waitForContent();

    const element = details.getContentElement()!;

    const originalStyles = {
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      height: element.style.height,
      padding: element.style.padding,
    };

    element.style.maxHeight = "none";
    element.style.overflow = "visible";
    element.style.height = "auto";
    element.style.padding = "12px";

    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      backgroundColor: "white",
      height: element.scrollHeight,
      width: element.scrollWidth,
    });

    element.style.maxHeight = originalStyles.maxHeight;
    element.style.overflow = originalStyles.overflow;
    element.style.height = originalStyles.height;
    element.style.padding = originalStyles.padding;

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

    pdf.save(`vistoria_${vehiclePlate}_${invoiceId}.pdf`);
  }

  async create(data: InvoiceCreationData): Promise<void> {
    await this.httpClient.post("/invoices", data);
  }

  async update(id: number, data: InvoiceUpdateData): Promise<void> {
    await this.httpClient.put(`/invoices/${id}`, data);
  }
}
