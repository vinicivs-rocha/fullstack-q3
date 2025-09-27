"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { useInvoice } from "@/hooks/use-invoice";
import { cn } from "@/lib/utils";
import {
  InvoiceCreationData,
  InvoiceCreationDataSchema,
  InvoiceStatus,
} from "@fullstack-q3/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Car,
  Check,
  CheckCircle,
  ChevronsUpDown,
  Clock,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function NovaVistoriaPage() {
  const {
    vehiclesQuery,
    problemsQuery,
    createInvoiceMutation,
    newProblemInput,
    setNewProblemInput,
    isProblemsComboboxOpen,
    setIsProblemsComboboxOpen,
  } = useInvoice();

  const form = useForm<InvoiceCreationData>({
    resolver: zodResolver(InvoiceCreationDataSchema),
    defaultValues: {
      vehicleId: undefined,
      problems: [],
      status: "PENDENTE",
      price: 0,
      duration: 0,
      observation: "",
    },
  });

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case "APROVADA":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "PENDENTE":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "REPROVADA":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "APROVADA":
        return "text-green-600 bg-green-50 border-green-200";
      case "PENDENTE":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "REPROVADA":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nova Vistoria
              </h1>
              <p className="text-gray-600">Criar uma nova vistoria veicular</p>
            </div>
            <Link href="/vistorias">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                createInvoiceMutation.mutate(data),
              )}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações do Veículo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="mr-2 h-5 w-5" />
                      Informações do Veículo
                    </CardTitle>
                    <CardDescription>
                      Selecione o veículo que será vistoriado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="vehicleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Veículo</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um veículo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehiclesQuery.data?.map((vehicle) => (
                                <SelectItem
                                  key={vehicle.id}
                                  value={vehicle.id.toString()}
                                >
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {vehicle.plate}
                                    </Badge>
                                    <span>
                                      {vehicle.brand} {vehicle.model} (
                                      {vehicle.year})
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Informações da Vistoria */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Vistoria</CardTitle>
                    <CardDescription>
                      Defina os detalhes da vistoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(
                                [
                                  "PENDENTE",
                                  "APROVADA",
                                  "REPROVADA",
                                ] as InvoiceStatus[]
                              ).map((status) => (
                                <SelectItem key={status} value={status}>
                                  <div
                                    className={`flex items-center space-x-2 px-2 py-1 rounded ${getStatusColor(status)}`}
                                  >
                                    {getStatusIcon(status)}
                                    <span>{status}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço</FormLabel>
                            <FormControl>
                              <CurrencyInput {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duração</FormLabel>
                            <FormControl>
                              <TimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Selecione a duração da vistoria"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Problemas Encontrados */}
              <Card>
                <CardHeader>
                  <CardTitle>Problemas Encontrados</CardTitle>
                  <CardDescription>
                    Selecione problemas identificados durante a vistoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="problems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problemas</FormLabel>
                        <Popover
                          open={isProblemsComboboxOpen}
                          onOpenChange={setIsProblemsComboboxOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isProblemsComboboxOpen}
                                className="w-full justify-between"
                              >
                                {field.value.length > 0
                                  ? `${field.value.length} problema(s) selecionado(s)`
                                  : "Selecione os problemas..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Buscar problemas..."
                                value={newProblemInput}
                                onValueChange={setNewProblemInput}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  <div className="py-6 text-center text-sm">
                                    <p className="mb-2">
                                      Nenhum problema encontrado.
                                    </p>
                                    {newProblemInput.trim() && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newProblems = [
                                            ...field.value,
                                            { label: newProblemInput.trim() },
                                          ];
                                          field.onChange(newProblems);
                                        }}
                                        className="gap-2"
                                      >
                                        <Plus className="h-4 w-4" />
                                        Adicionar &quot;{newProblemInput.trim()}
                                        &quot;
                                      </Button>
                                    )}
                                  </div>
                                </CommandEmpty>
                                <CommandGroup>
                                  {problemsQuery.data?.map((problem) => {
                                    const isSelected = field.value.some(
                                      (selectedProblem) =>
                                        selectedProblem.id === problem.id,
                                    );
                                    return (
                                      <CommandItem
                                        key={problem.id}
                                        value={problem.label}
                                        onSelect={() => {
                                          if (isSelected) {
                                            const newProblems =
                                              field.value.filter(
                                                (selectedProblem) =>
                                                  selectedProblem.id !==
                                                  problem.id,
                                              );
                                            field.onChange(newProblems);
                                          } else {
                                            const newProblems = [
                                              ...field.value,
                                              {
                                                id: problem.id,
                                                label: problem.label,
                                              },
                                            ];
                                            field.onChange(newProblems);
                                          }
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            isSelected
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {problem.label}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {/* Mostrar problemas selecionados */}
                        {field.value.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {field.value.map((problem) => (
                              <Badge
                                key={problem.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {problem.label}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newProblems = field.value.filter(
                                      (selectedProblem) =>
                                        selectedProblem.id !== problem.id,
                                    );
                                    field.onChange(newProblems);
                                  }}
                                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Observações */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                  <CardDescription>
                    Adicione observações adicionais sobre a vistoria (opcional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Descreva observações adicionais sobre a vistoria..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/vistorias">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={createInvoiceMutation.isPending}
                  className="min-w-[120px]"
                >
                  {createInvoiceMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Vistoria"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
