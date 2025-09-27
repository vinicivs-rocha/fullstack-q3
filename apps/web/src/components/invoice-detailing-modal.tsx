"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DetailedInvoiceResponse } from "@fullstack-q3/contracts";
import {
  Car,
  Check,
  Clock,
  Download,
  Mail,
  Phone,
  User,
  X,
  Calendar,
  DollarSign,
  Timer,
  FileText,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { forwardRef, useRef, useImperativeHandle } from "react";

interface InvoiceDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: DetailedInvoiceResponse | undefined;
  isLoading: boolean;
  onDownload: () => void;
}

export interface InvoiceDetailingModalRef {
  getContentElement: () => HTMLDivElement | null;
  waitForContent: () => Promise<void>;
}

export const InvoiceDetailingModal = forwardRef<
  InvoiceDetailingModalRef,
  InvoiceDetailingModalProps
>(({ isOpen, onClose, invoice, isLoading, onDownload }, ref) => {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      dialogContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    scrollToBottom: () => {
      dialogContentRef.current?.scrollTo({
        top: dialogContentRef.current?.scrollHeight,
        behavior: "smooth",
      });
    },
    getContentElement: () => mainContentRef.current,
    waitForContent: async () => {
      while (
        !mainContentRef.current ||
        mainContentRef.current.children.length === 0
      ) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    },
  }));

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "APROVADA":
        return {
          icon: <Check className="mr-2 h-4 w-4" />,
          text: "Aprovada",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "PENDENTE":
        return {
          icon: <Clock className="mr-2 h-4 w-4" />,
          text: "Pendente",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "REPROVADA":
        return {
          icon: <X className="mr-2 h-4 w-4" />,
          text: "Reprovada",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          icon: "",
          text: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          aria-describedby={`invoice-detailing-modal-${invoice?.id}`}
          className="min-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Carregando detalhes da vistoria...</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!invoice) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          aria-describedby={`invoice-detailing-modal-error`}
          className="min-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Erro ao carregar vistoria</DialogTitle>
            <DialogDescription>
              Não foi possível carregar os detalhes da vistoria.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const statusConfig = getStatusConfig(invoice.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={dialogContentRef}
        showCloseButton={false}
        aria-describedby={`invoice-detailing-modal-${invoice.id}`}
        className="min-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Detalhes da Vistoria
              </DialogTitle>
              <DialogDescription>
                Informações completas da vistoria do veículo{" "}
                {invoice.vehicle.plate}
              </DialogDescription>
            </div>
            <Button
              onClick={onDownload}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </DialogHeader>

        <div ref={mainContentRef} className="space-y-6">
          {/* Status e Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge className={`${statusConfig.className} border`}>
                {statusConfig.icon}
                {statusConfig.text}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Data da Vistoria
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {new Date(invoice.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                ID da Vistoria
              </h3>
              <span className="text-sm font-mono">#{invoice.id}</span>
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
                <label className="text-sm font-medium text-gray-500">
                  Placa
                </label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                  {invoice.vehicle.plate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Marca/Modelo
                </label>
                <p className="text-sm">
                  {invoice.vehicle.brand} {invoice.vehicle.model}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ano</label>
                <p className="text-sm">{invoice.vehicle.year}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cor</label>
                <p className="text-sm">{invoice.vehicle.color}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Chassi
                </label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                  {invoice.vehicle.chassisNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Combustível
                </label>
                <p className="text-sm">{invoice.vehicle.fuelType}</p>
              </div>
              {invoice.vehicle.mileage && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Quilometragem
                  </label>
                  <p className="text-sm">
                    {invoice.vehicle.mileage.toLocaleString("pt-BR")} km
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Informações do Vistoriador */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Vistoriador
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Nome
                </label>
                <p className="text-sm">{invoice.surveyor.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Gênero
                </label>
                <p className="text-sm">
                  {invoice.surveyor.gender === "M" ? "Masculino" : "Feminino"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Licença
                </label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                  {invoice.surveyor.license}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{invoice.surveyor.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Telefone
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{invoice.surveyor.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Financeiras */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Valor da Vistoria
                </label>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(invoice.price)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Duração
                </label>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{formatDuration(invoice.duration)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Problemas Identificados */}
          {invoice.problems && invoice.problems.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Problemas Identificados
              </h3>
              <div className="flex flex-wrap gap-2">
                {invoice.problems.map((problem) => (
                  <Badge
                    key={problem.id}
                    variant="destructive"
                    className="flex items-center gap-1 bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {problem.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Observações */}
          {invoice.observation && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Observações
              </h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {invoice.observation}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

InvoiceDetailingModal.displayName = "InvoiceDetailingModal";
