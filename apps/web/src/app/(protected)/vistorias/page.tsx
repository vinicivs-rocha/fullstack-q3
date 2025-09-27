"use client";

import { InvoiceDetailingModal } from "@/components/invoice-detailing-modal";
import { InvoicesSearch } from "@/components/invoices-search";
import { StatsCards } from "@/components/stats-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useInvoice } from "@/hooks/use-invoice";
import { InvoicesListResponse } from "@fullstack-q3/contracts";
import { PaginationState, Row } from "@tanstack/react-table";
import {
  Car,
  Check,
  Clock,
  Download,
  Eye,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";

export default function VistoriasPage() {
  const {
    invoicesQuery,
    statsQuery,
    page,
    setPage,
    status,
    setStatus,
    startsAt,
    setStartsAt,
    endsAt,
    setEndsAt,
    search,
    setSearch,
    detail,
    stopDetailing,
    invoiceDetailsQuery,
    isDetailing,
    exportInvoiceMutation,
    detailingModalRef,
    exportInvoice,
  } = useInvoice();

  const columns = [
    {
      accessorKey: "vehicle.plate",
      header: "Veículo",
      cell: ({
        row,
      }: {
        row: Row<InvoicesListResponse["invoices"][number]>;
      }) => {
        const vistoria = row.original;
        return (
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 h-8 w-8">
              <Badge className="h-8 w-8 bg-accent text-accent-foreground border border-accent-foreground/20">
                <Car className="h-6 w-6 text-accent-foreground" />
              </Badge>
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {vistoria.vehicle.plate}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {vistoria.vehicle.brand} {vistoria.vehicle.model}{" "}
                {vistoria.vehicle.year}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({
        row,
      }: {
        row: Row<InvoicesListResponse["invoices"][number]>;
      }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm whitespace-nowrap">
            {date.toLocaleDateString("pt-BR")}
          </div>
        );
      },
    },
    {
      accessorKey: "surveyor.name",
      header: "Vistoriador",
      cell: ({
        row,
      }: {
        row: Row<InvoicesListResponse["invoices"][number]>;
      }) => {
        const vistoria = row.original;
        return (
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 h-6 w-6">
              <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {vistoria.surveyor.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {vistoria.surveyor.name}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({
        row,
      }: {
        row: Row<InvoicesListResponse["invoices"][number]>;
      }) => {
        const status = row.getValue("status") as string;

        const getStatusConfig = (status: string) => {
          switch (status) {
            case "APROVADA":
              return {
                icon: <Check className="mr-2 h-4 w-4" />,
                text: "Aprovada",
                className: "text-green-600",
              };
            case "PENDENTE":
              return {
                icon: <Clock className="mr-2 h-4 w-4" />,
                text: "Pendente",
                className: "text-yellow-600",
              };
            case "REPROVADA":
              return {
                icon: <X className="mr-2 h-4 w-4" />,
                text: "Reprovada",
                className: "text-red-600",
              };
            default:
              return { icon: "", text: status, className: "text-gray-600" };
          }
        };

        const config = getStatusConfig(status);

        return (
          <div className="flex items-center">
            <Badge
              variant="secondary"
              className={`mr-2 ${config.className} whitespace-nowrap`}
            >
              {config.icon}
              <span className="text-sm">{config.text}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({
        row,
      }: {
        row: Row<InvoicesListResponse["invoices"][number]>;
      }) => {
        const invoice = row.original;

        return (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => detail(invoice.id)}
              className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
              asChild
            >
              <Link href={`/vistorias/editar/${invoice.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportInvoice(invoice.id)}
              className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const pagination = {
    pageIndex: page - 1,
    pageSize: 10,
  };

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState),
  ) => {
    if (typeof updaterOrValue === "function") {
      const newPagination = updaterOrValue(pagination);
      setPage(newPagination.pageIndex + 1);
    } else {
      setPage(updaterOrValue.pageIndex + 1);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Vistorias
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gerencie todas as vistorias realizadas
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/vistorias/nova">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nova Vistoria</span>
                <span className="sm:hidden">Nova</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className="h-full flex flex-col">
          {/* Search and Filters */}
          <InvoicesSearch
            status={status}
            onStatusChange={setStatus}
            period={
              startsAt && endsAt ? { start: startsAt, end: endsAt } : undefined
            }
            onPeriodChange={(period) => {
              if (period) {
                setStartsAt(period.start);
                setEndsAt(period.end);
              } else {
                setStartsAt(undefined);
                setEndsAt(undefined);
              }
            }}
            search={search}
            onSearchChange={setSearch}
          />

          {/* Stats Cards */}
          <div className="mb-6 flex-shrink-0">
            <StatsCards
              stats={
                statsQuery.data ?? {
                  total: 0,
                  pending: 0,
                  approved: 0,
                  rejected: 0,
                }
              }
              isLoading={statsQuery.isLoading}
            />
          </div>

          {/* DataTable */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-base sm:text-lg font-medium">
                Lista de Vistorias
              </h3>
            </div>

            <DataTable
              columns={columns}
              data={invoicesQuery.data?.invoices ?? []}
              onPaginationChange={handlePaginationChange}
              pagination={pagination}
              manualPagination={true}
              totalRows={invoicesQuery.data?.total ?? 0}
              isLoading={invoicesQuery.isLoading}
            />
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <InvoiceDetailingModal
        ref={detailingModalRef}
        isOpen={isDetailing}
        onClose={stopDetailing}
        invoice={invoiceDetailsQuery.data}
        isLoading={invoiceDetailsQuery.isLoading}
        onDownload={() => {
          exportInvoiceMutation.mutate();
        }}
      />
    </>
  );
}
