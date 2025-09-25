"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VehicleStatus } from "@fullstack-q3/contracts";
import { Check, ChevronsUpDown, Clock, Search, X } from "lucide-react";
import { useState } from "react";

interface VehiclesSearchProps {
  status: VehicleStatus | undefined;
  onStatusChange: (status: VehicleStatus | undefined) => void;
  year: number | undefined;
  onYearChange: (year: number | undefined) => void;
  brand: string | undefined;
  onBrandChange: (brand: string | undefined) => void;
  search: string | undefined;
  onSearchChange: (search: string | undefined) => void;
  years: number[];
  brands: string[];
  isLoading?: boolean;
}

const statusOptions: { value: VehicleStatus, label: string, icon: React.ReactNode }[] = [
  { value: "ATIVO", label: "Ativos", icon: <Check className="mr-2 h-4 w-4" /> },
  { value: "PENDENTE", label: "Pendentes", icon: <Clock className="mr-2 h-4 w-4" /> },
  { value: "INATIVO", label: "Inativos", icon: <X className="mr-2 h-4 w-4" /> },
];

export function VehiclesSearch({ 
  status, 
  onStatusChange, 
  year, 
  onYearChange, 
  brand, 
  onBrandChange, 
  search, 
  onSearchChange,
  years,
  brands, 
}: VehiclesSearchProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (status) count++;
    if (year) count++;
    if (brand) count++;
    return count;
  };

  const getStatusLabel = () => {
    switch (status) {
      case "ATIVO": return "Ativos";
      case "PENDENTE": return "Pendentes";
      case "INATIVO": return "Inativos";
      default: return "Status";
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Campo de busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por placa, modelo, proprietário..."
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
                <Button variant="outline" className="w-[140px] justify-between">
                  {status ? getStatusLabel() : "Status"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar status..." />
                  <CommandList>
                    <CommandEmpty>Nenhum status encontrado.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          onStatusChange(undefined);
                          setStatusOpen(false);
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Todos os Status
                      </CommandItem>
                      {statusOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            onStatusChange(option.value);
                            setStatusOpen(false);
                          }}
                        >
                          {option.icon}
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Filtro de Ano */}
            <Popover open={yearOpen} onOpenChange={setYearOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[100px] justify-between">
                  {year ? year.toString() : "Ano"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar ano..." />
                  <CommandList>
                    <CommandEmpty>Nenhum ano encontrado.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          onYearChange(undefined);
                          setYearOpen(false);
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Todos os Anos
                      </CommandItem>
                      {years.map((yearOption) => (
                        <CommandItem
                          key={yearOption}
                          onSelect={() => {
                            onYearChange(yearOption);
                            setYearOpen(false);
                          }}
                        >
                          {yearOption}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Filtro de Marca */}
            <Popover open={brandOpen} onOpenChange={setBrandOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  {brand || "Todas as Marcas"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar marca..." />
                  <CommandList>
                    <CommandEmpty>Nenhuma marca encontrada.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          onBrandChange(undefined);
                          setBrandOpen(false);
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Todas as Marcas
                      </CommandItem>
                      {brands.map((brandOption) => (
                        <CommandItem
                          key={brandOption}
                          onSelect={() => {
                            onBrandChange(brandOption);
                            setBrandOpen(false);
                          }}
                        >
                          {brandOption}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Badges dos filtros ativos */}
        {getActiveFiltersCount() > 0 ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {search && (
              <Badge variant="secondary" className="gap-1" onClick={() => onSearchChange(undefined)}>
                Busca: {search}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onSearchChange(undefined)}
                />
              </Badge>
            )}
            {status && (
              <Badge variant="secondary" className="gap-1" onClick={() => onStatusChange(undefined)}>
                Status: {getStatusLabel()}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onStatusChange(undefined)}
                />
              </Badge>
            )}
            {year && (
                <Badge variant="secondary" className="gap-1" onClick={() => onYearChange(undefined)}>
                Ano: {year}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                />
              </Badge>
            )}
            {brand && (
              <Badge variant="secondary" className="gap-1" onClick={() => onBrandChange(undefined)}>
                Marca: {brand}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onBrandChange(undefined)}
                />
              </Badge>
            )}
          </div>
        ) : undefined}
      </div>
    </div>
  );
} 