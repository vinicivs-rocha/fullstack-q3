"use client";

import { InvoicesSearch } from "@/components/invoices-search";
import { StatsCards } from "@/components/stats-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useInvoice } from "@/hooks/use-invoice";
import { Invoice } from "@fullstack-q3/contracts";
import { PaginationState, Row } from "@tanstack/react-table";
import { Car, Check, Clock, Download, Eye, Pencil, Plus, X } from "lucide-react";

const columns = [
  {
    accessorKey: "vehicle.plate",
    header: "Veículo",
    cell: ({ row }: {row: Row<Invoice>}) => {
      const vistoria = row.original;
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <Badge className="h-8 w-8 bg-accent text-accent-foreground border border-accent-foreground/20">
              <Car className="h-6 w-6 text-accent-foreground" />
            </Badge>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {vistoria.vehicle.plate}
            </div>
            <div className="text-sm text-gray-500">
              {vistoria.vehicle.brand} {vistoria.vehicle.model} {vistoria.vehicle.year}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }: {row: Row<Invoice>}) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm">{date.toLocaleDateString('pt-BR')}</div>;
    },
  },
  {
    accessorKey: "surveyor.name",
    header: "Vistoriador",
    cell: ({ row }: {row: Row<Invoice>}) => {
      const vistoria = row.original;
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-6 w-6">
            <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {vistoria.surveyor.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
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
    cell: ({ row }: {row: Row<Invoice>}) => {
      const status = row.getValue("status") as string;
      
      const getStatusConfig = (status: string) => {
        switch (status) {
          case "APROVADA":
            return { icon: <Check className="mr-2 h-4 w-4" />, text: "Aprovada", className: "text-green-600" };
          case "PENDENTE":
            return { icon: <Clock className="mr-2 h-4 w-4" />, text: "Pendente", className: "text-yellow-600" };
          case "REPROVADA":
            return { icon: <X className="mr-2 h-4 w-4" />, text: "Reprovada", className: "text-red-600" };
          default:
            return { icon: "", text: status, className: "text-gray-600" };
        }
      };

      const config = getStatusConfig(status);
      
      return (
        <div className="flex items-center">
          <Badge variant="secondary" className={`mr-2 ${config.className}`}>
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
    cell: ({ row }: {row: Row<Invoice>}) => {
      const vistoria = row.original;

      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Visualizar vistoria:", vistoria.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Editar vistoria:", vistoria.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Download vistoria:", vistoria.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

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
  } = useInvoice();

  const pagination = {
    pageIndex: page - 1,
    pageSize: 10,
  };

  const handlePaginationChange = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
    if (typeof updaterOrValue === 'function') {
      const newPagination = updaterOrValue(pagination);
      setPage(newPagination.pageIndex + 1);
    } else {
      setPage(updaterOrValue.pageIndex + 1);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vistorias</h1>
            <p className="text-gray-600">Gerencie todas as vistorias realizadas</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Vistoria
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Search and Filters */}
        <InvoicesSearch 
          status={status}
          onStatusChange={setStatus}
          period={ startsAt && endsAt ? { start: startsAt, end: endsAt } : undefined }
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
        <div className="mb-6">
          <StatsCards stats={statsQuery.data ?? { total: 0, pending: 0, approved: 0, rejected: 0 }} isLoading={statsQuery.isLoading} />
        </div>

        {/* DataTable */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Lista de Vistorias</h3>
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
    </>
  );
}
