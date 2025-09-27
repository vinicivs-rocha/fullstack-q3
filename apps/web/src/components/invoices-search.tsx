"use client";

import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@fullstack-q3/contracts";
import { Check, ChevronsUpDown, Clock, Search, X, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { DateRangePicker } from "./ui/date-range-picker";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface InvoicesSearchProps {
  status: InvoiceStatus | undefined;
  onStatusChange: (status: InvoiceStatus | undefined) => void;
  period: { start: string | undefined; end: string | undefined } | undefined;
  onPeriodChange: (
    period: { start: string | undefined; end: string | undefined } | undefined,
  ) => void;
  search: string | undefined;
  onSearchChange: (search: string | undefined) => void;
}

const statusOptions: {
  value: InvoiceStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "PENDENTE",
    label: "Pendentes",
    icon: <Clock className="mr-2 h-4 w-4" />,
  },
  {
    value: "APROVADA",
    label: "Aprovadas",
    icon: <Check className="mr-2 h-4 w-4" />,
  },
  {
    value: "REPROVADA",
    label: "Reprovadas",
    icon: <X className="mr-2 h-4 w-4" />,
  },
];

export function InvoicesSearch({
  status,
  onStatusChange,
  period,
  onPeriodChange,
  search,
  onSearchChange,
}: InvoicesSearchProps) {
  const [statusOpen, setStatusOpen] = useState(false);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (status) count++;
    if (period) count++;
    return count;
  };

  const getStatusLabel = (status: InvoiceStatus | undefined | null) => {
    switch (status) {
      case "PENDENTE":
        return "Pendentes";
      case "APROVADA":
        return "Aprovadas";
      case "REPROVADA":
        return "Reprovadas";
      default:
        return "Todos os Status";
    }
  };

  const clearAllFilters = () => {
    onSearchChange("");
    onStatusChange(undefined);
    onPeriodChange(undefined);
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* Layout principal responsivo */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de busca - sempre em destaque */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por placa, modelo, marca..."
                value={search || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Container de filtros responsivo */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
            {/* Filtro de Status */}
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={statusOpen}
                  className="w-full sm:w-[140px] lg:w-[160px] justify-between text-sm"
                >
                  <span className="truncate">{getStatusLabel(status)}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[200px] p-0"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <Command>
                  <CommandInput placeholder="Buscar status..." />
                  <CommandList>
                    <CommandEmpty>Nenhum status encontrado.</CommandEmpty>
                    <CommandGroup>
                      {statusOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => onStatusChange(option.value)}
                        >
                          <span className="mr-2">{option.icon}</span>
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* DateRangePicker responsivo */}
            <div className="w-full sm:w-auto">
              <DateRangePicker
                date={
                  period && {
                    from: period.start ? new Date(period.start) : undefined,
                    to: period.end ? new Date(period.end) : undefined,
                  }
                }
                onDateChange={(date) =>
                  onPeriodChange(
                    date
                      ? {
                          start: date.from?.toISOString(),
                          end: date.to?.toISOString(),
                        }
                      : undefined,
                  )
                }
                className="w-full sm:w-[200px] lg:w-[260px]"
                placeholder="Período"
              />
            </div>
          </div>
        </div>

        {/* Filtros ativos com melhor layout */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtros ativos:
                </span>

                {search && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSearchChange("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onSearchChange("");
                      }
                    }}
                  >
                    <span className="truncate max-w-[120px]">
                      Busca: {search}
                    </span>
                    <X
                      className="h-3 w-3 cursor-pointer text-primary hover:text-primary/80 flex-shrink-0"
                      tabIndex={0}
                      role="button"
                      aria-label="Remover filtro de busca"
                    />
                  </Badge>
                )}

                {status && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(undefined);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onStatusChange(undefined);
                      }
                    }}
                  >
                    <span className="truncate">
                      Status: {getStatusLabel(status)}
                    </span>
                    <X
                      className="h-3 w-3 cursor-pointer text-primary hover:text-primary/80 flex-shrink-0"
                      tabIndex={0}
                      role="button"
                      aria-label="Remover filtro de status"
                    />
                  </Badge>
                )}

                {period && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPeriodChange(undefined);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onPeriodChange(undefined);
                      }
                    }}
                  >
                    <span className="truncate">Período: Personalizado</span>
                    <X
                      className="h-3 w-3 cursor-pointer text-primary hover:text-primary/80 flex-shrink-0"
                      tabIndex={0}
                      role="button"
                      aria-label="Remover filtro de período"
                    />
                  </Badge>
                )}
              </div>

              {/* Botão para limpar todos os filtros */}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 text-sm self-start sm:self-auto"
              >
                Limpar todos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
