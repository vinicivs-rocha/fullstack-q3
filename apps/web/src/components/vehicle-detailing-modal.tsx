"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FuelType, VehicleDetailsResponse } from "@fullstack-q3/contracts";
import {
  Calendar,
  Car,
  Check,
  Clock,
  FileText,
  Fuel,
  Gauge,
  Hash,
  Mail,
  Palette,
  User,
  X
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface VehicleDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleDetailsResponse | undefined;
  isLoading: boolean;
}

export const VehicleDetailingModal = ({ 
  isOpen, 
  onClose, 
  vehicle, 
  isLoading,
}: VehicleDetailingModalProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getFuelType = (fuelType: FuelType) => {
    switch (fuelType) {
      case "GASOLINA":
        return "Gasolina";
      case "ETANOL":
        return "Etanol";
      case "FLEX":
        return "Flex";
      case "DIESEL":
        return "Diesel";
      case "ELETRICO":
        return "Elétrico";
      case "HIBRIDO":
        return "Híbrido";
      default:
        return fuelType;
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          showCloseButton={false} 
          className="min-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Detalhes do Veículo
                </DialogTitle>
                <DialogDescription>
                  Carregando informações do veículo...
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status e Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Informações do Veículo */}
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Informações do Proprietário */}
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico de Vistorias */}
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        showCloseButton={false} 
        aria-describedby={`vehicle-detailing-modal-${vehicle.id}`} 
        className="min-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Detalhes do Veículo
              </DialogTitle>
              <DialogDescription>
                Informações completas do veículo {vehicle.plate}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Placa</h3>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                  {vehicle.plate}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Data de Cadastro</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {new Date(vehicle.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">ID do Veículo</h3>
              <span className="text-sm font-mono">#{vehicle.id}</span>
            </div>
          </div>

          {/* Informações do Veículo */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Car className="h-5 w-5" />
              Informações do Veículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Placa</label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                  {vehicle.plate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Marca/Modelo</label>
                <p className="text-sm">{vehicle.brand} {vehicle.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ano</label>
                <p className="text-sm">{vehicle.year}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cor</label>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{vehicle.color}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Chassi</label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                  {vehicle.chassisNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Combustível</label>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{getFuelType(vehicle.fuelType)}</p>
                </div>
              </div>
              {vehicle.mileage && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Quilometragem</label>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                      {vehicle.mileage.toLocaleString('pt-BR')} km
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações do Proprietário */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Proprietário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-sm">{vehicle.proprietary.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{vehicle.proprietary.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de Vistorias */}
          {vehicle.invoices && vehicle.invoices.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histórico de Vistorias ({vehicle.invoices.length})
              </h3>
              <div className="space-y-3">
                {vehicle.invoices.map((invoice) => {
                  const getStatusConfig = (status: string) => {
                    switch (status) {
                      case "APROVADA":
                        return { 
                          icon: <Check className="h-4 w-4" />, 
                          text: "Aprovada", 
                          className: "bg-green-100 text-green-800 border-green-200" 
                        };
                      case "PENDENTE":
                        return { 
                          icon: <Clock className="h-4 w-4" />, 
                          text: "Pendente", 
                          className: "bg-yellow-100 text-yellow-800 border-yellow-200" 
                        };
                      case "REPROVADA":
                        return { 
                          icon: <X className="h-4 w-4" />, 
                          text: "Reprovada", 
                          className: "bg-red-100 text-red-800 border-red-200" 
                        };
                      default:
                        return { 
                          icon: "", 
                          text: status, 
                          className: "bg-gray-100 text-gray-800 border-gray-200" 
                        };
                    }
                  };

                  const statusConfig = getStatusConfig(invoice.status);

                  return (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-8 w-8">
                          <Badge className="h-8 w-8 bg-accent text-accent-foreground border border-accent-foreground/20">
                            <FileText className="h-4 w-4 text-accent-foreground" />
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Vistoria #{invoice.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${statusConfig.className} border`}>
                          {statusConfig.icon}
                          {statusConfig.text}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(invoice.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mensagem quando não há vistorias */}
          {(!vehicle.invoices || vehicle.invoices.length === 0) && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histórico de Vistorias
              </h3>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma vistoria registrada para este veículo</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 