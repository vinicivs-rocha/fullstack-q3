"use client";

import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@fullstack-q3/contracts";
import { Check, ChevronsUpDown, Clock, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { DateRangePicker } from "./ui/date-range-picker";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
  
interface InvoicesSearchProps {
  status: InvoiceStatus | undefined;
  onStatusChange: (status: InvoiceStatus | undefined) => void;
  period: { start: string | undefined, end: string | undefined } | undefined;
  onPeriodChange: (period: { start: string | undefined, end: string | undefined } | undefined) => void;
  search: string | undefined;
  onSearchChange: (search: string | undefined) => void;
}

const statusOptions: { value: InvoiceStatus, label: string, icon: React.ReactNode }[] = [
  { value: "PENDENTE", label: "Pendentes", icon: <Clock className="mr-2 h-4 w-4" /> },
  { value: "APROVADA", label: "Aprovadas", icon: <Check className="mr-2 h-4 w-4" /> },
  { value: "REPROVADA", label: "Reprovadas", icon: <X className="mr-2 h-4 w-4" /> },
];

export function InvoicesSearch({ status, onStatusChange, period, onPeriodChange, search, onSearchChange }: InvoicesSearchProps) {
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
      case "PENDENTE": return "Pendentes";
      case "APROVADA": return "Aprovadas";
      case "REPROVADA": return "Reprovadas";
      default: return "Todos os Status";
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Campo de busca simples */}
          <div className="flex-1">
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
          
          
          {/* Filtros */}
          <div className="flex gap-2">
            {/* Filtro de Status */}
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={statusOpen}
                  className="w-[160px] justify-between"
                >
                  {getStatusLabel(status)}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
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
            
            <DateRangePicker
              date={period && { from: period.start ? new Date(period.start) : undefined, to: period.end ? new Date(period.end) : undefined }}
              onDateChange={(date) => onPeriodChange(date ? { start: date.from?.toISOString(), end: date.to?.toISOString() } : undefined)}
            />
          </div>
        </div>
        
        {/* Filtros ativos */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {search && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20"
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
                Busca: {search}
                <X
                  className="h-3 w-3 cursor-pointer text-primary hover:text-primary/80"
                  tabIndex={0}
                  role="button"
                  aria-label="Remover filtro de busca"
                />
              </Badge>
            )}
            {status && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20"
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
                Status: {getStatusLabel(status)}
                <X
                  className="h-3 w-3 cursor-pointer text-primary hover:text-primary/80"
                  tabIndex={0}
                  role="button"
                  aria-label="Remover filtro de status"
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
                />
              </Badge>
            )}
            {period && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-sec/10 text-primary border border-primary/20"
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
                Período: Personalizado
                <X
                  className="h-3 w-3 cursor-pointer text-primary hover:text-primary/80"
                  tabIndex={0}
                  role="button"
                  aria-label="Remover filtro de período"
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
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
