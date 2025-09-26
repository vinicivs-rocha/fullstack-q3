"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { VehiclesSearch } from "@/components/vehicles-search";
import { VehicleStatsCards } from "@/components/vehicles-stats-cards";
import { VehicleDetailingModal } from "@/components/vehicle-detailing-modal";
import { useVehicle } from "@/hooks/use-vehicle";
import { VehiclePaginatedListResponse } from "@fullstack-q3/contracts";
import { Row } from "@tanstack/react-table";
import { Car, Check, Clock, Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

export default function VeiculosPage() {
  const {
    vehiclesYearsQuery,
    vehiclesBrandsQuery,
    vehiclesCountsQuery,
    vehiclesPaginatedListQuery,
    pagination,
    onPaginationChange,
    status,
    setStatus,
    year,
    setYear,
    brand,
    setBrand,
    search,
    setSearch,
    detail,
    stopDetailing,
    vehicleDetailsQuery,
    isDetailing,
    delete: deleteVehicle,
  } = useVehicle();

  // Configuração das colunas da tabela
  const columns = [
    {
      accessorKey: "vehicle",
      header: "Veículo",
      cell: ({ row }: { row: Row<VehiclePaginatedListResponse['vehicles'][number]> }) => {
        const vehicle = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-gray-400" />
            <div>
              <div className="font-medium">{vehicle.plate}</div>
              <div className="text-sm text-gray-500">{vehicle.brand} {vehicle.model} {vehicle.year}</div>
              <div className="text-xs text-gray-400">Chassi: {vehicle.chassisNumber}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "owner",
      header: "Proprietário",
      cell: ({ row }: { row: Row<VehiclePaginatedListResponse['vehicles'][number]> }) => {
        const vehicle = row.original;
        return (
          <div>
            <div className="font-medium">{vehicle.proprietary.name}</div>
            <div className="text-sm text-gray-500">{vehicle.proprietary.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Cadastro",
      cell: ({ row }: { row: Row<VehiclePaginatedListResponse['vehicles'][number]> }) => {
        return new Date(row.original.createdAt).toLocaleDateString('pt-BR');
      },
    },
    {
      accessorKey: "lastInspection",
      header: "Última Vistoria",
      cell: ({ row }: { row: Row<VehiclePaginatedListResponse['vehicles'][number]> }) => {
        const lastInspection = row.original.lastSurveyDate;
        return lastInspection 
          ? new Date(lastInspection).toLocaleDateString('pt-BR')
          : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: Row<VehiclePaginatedListResponse['vehicles'][number]> }) => {
        const status = row.original.status;
        const statusConfig = {
          ATIVO: { 
            icon: <Check className="h-4 w-4" />, 
            label: "Ativo", 
            className: "bg-green-100 text-green-800 border-green-200" 
          },
          PENDENTE: { 
            icon: <Clock className="h-4 w-4" />, 
            label: "Pendente", 
            className: "bg-yellow-100 text-yellow-800 border-yellow-200" 
          },
          INATIVO: { 
            icon: <X className="h-4 w-4" />, 
            label: "Inativo", 
            className: "bg-red-100 text-red-800 border-red-200" 
          },
        };

        const config = statusConfig[status];
        return (
          <Badge className={`${config.className} border`}>
            {config.icon}
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: { row: Row<VehiclePaginatedListResponse['vehicles'][number]> }) => {
        const vehicle = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => detail(vehicle.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-gray-600"
              asChild
            >
              <Link href={`/veiculos/editar/${vehicle.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => deleteVehicle(vehicle.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const stats = vehiclesCountsQuery.data ? {
    total: vehiclesCountsQuery.data.total,
    active: vehiclesCountsQuery.data.active,
    pending: vehiclesCountsQuery.data.pending,
    inactive: vehiclesCountsQuery.data.inactive,
  } : {
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
  };

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
            <p className="text-gray-600">Gerencie todos os veículos cadastrados</p>
          </div>
          <Button asChild>
            <Link href="/veiculos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Veículo
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Search and Filters */}
        <VehiclesSearch 
          status={status}
          onStatusChange={setStatus}
          year={year}
          onYearChange={setYear}
          brand={brand}
          onBrandChange={setBrand}
          search={search}
          onSearchChange={setSearch}
          years={vehiclesYearsQuery.data ?? []}
          brands={vehiclesBrandsQuery.data ?? []}
          isLoading={vehiclesYearsQuery.isLoading || vehiclesBrandsQuery.isLoading}
        />

        {/* Stats Cards */}
        <div className="mb-6">
          <VehicleStatsCards 
            stats={stats} 
            isLoading={vehiclesCountsQuery.isLoading} 
          />
        </div>

        {/* DataTable */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Lista de Veículos</h3>
          </div>
          
          <DataTable 
            columns={columns} 
            data={vehiclesPaginatedListQuery.data?.vehicles ?? []}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
            manualPagination={true}
            totalRows={vehiclesPaginatedListQuery.data?.total ?? 0}
            isLoading={vehiclesPaginatedListQuery.isLoading}
          />
        </div>
      </div>

      {/* Modal de Detalhes */}
      <VehicleDetailingModal
        isOpen={isDetailing}
        onClose={stopDetailing}
        vehicle={vehicleDetailsQuery.data}
        isLoading={vehicleDetailsQuery.isLoading}
      />
    </>
  );
} 