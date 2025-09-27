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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicle } from "@/hooks/use-vehicle";
import {
  FuelType,
  VehicleUpdatingData,
  VehicleUpdatingDataSchema,
} from "@fullstack-q3/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Calendar,
  Car,
  Gauge,
  Hash,
  Loader2,
  Mail,
  Palette,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditarVeiculoPage() {
  const { vehicleDetailsQuery, update } = useVehicle();

  const form = useForm<VehicleUpdatingData>({
    resolver: zodResolver(VehicleUpdatingDataSchema),
    defaultValues: {
      plate: "",
      model: "",
      brand: "",
      year: new Date().getFullYear(),
      color: "",
      fuelType: "FLEX",
      mileage: undefined,
      chassisNumber: "",
      proprietary: {
        name: "",
        email: "",
      },
    },
  });

  useEffect(() => {
    if (vehicleDetailsQuery.data) {
      const vehicle = vehicleDetailsQuery.data;
      form.reset({
        plate: vehicle.plate,
        model: vehicle.model,
        brand: vehicle.brand,
        year: vehicle.year,
        color: vehicle.color,
        fuelType: vehicle.fuelType,
        mileage: vehicle.mileage,
        chassisNumber: vehicle.chassisNumber,
        proprietary: {
          name: vehicle.proprietary.name,
          email: vehicle.proprietary.email,
        },
      });
    }
  }, [vehicleDetailsQuery.data, form]);

  const fuelTypeOptions: { value: FuelType; label: string }[] = [
    { value: "GASOLINA", label: "Gasolina" },
    { value: "ETANOL", label: "Etanol" },
    { value: "FLEX", label: "Flex" },
    { value: "DIESEL", label: "Diesel" },
    { value: "ELETRICO", label: "Elétrico" },
    { value: "HIBRIDO", label: "Híbrido" },
  ];

  const formatPlate = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return cleaned.replace(/^([A-Z]{3})([0-9]+)$/, "$1-$2");
    } else {
      return cleaned.replace(
        /^([A-Z]{3})([0-9])([A-Z])([0-9]{2})$/,
        "$1$2$3$4",
      );
    }
  };

  const handleUpdate = (data: VehicleUpdatingData) => {
    if (vehicleDetailsQuery.data) {
      update(vehicleDetailsQuery.data.id, data);
    }
  };

  if (vehicleDetailsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (vehicleDetailsQuery.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">Erro ao carregar veículo</p>
        <Link href="/veiculos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Veículos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Veículo
              </h1>
              <p className="text-gray-600">
                Editando veículo {vehicleDetailsQuery.data?.plate}
              </p>
            </div>
            <Link href="/veiculos">
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
              onSubmit={form.handleSubmit(handleUpdate)}
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
                    <CardDescription>Dados básicos do veículo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="plate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Placa</FormLabel>
                            {vehicleDetailsQuery.isLoading ? (
                              <Skeleton className="h-9 w-full" />
                            ) : (
                              <FormControl>
                                <Input
                                  placeholder="ABC-1234"
                                  {...field}
                                  onChange={(e) => {
                                    const formatted = formatPlate(
                                      e.target.value,
                                    );
                                    field.onChange(formatted);
                                  }}
                                  maxLength={8}
                                  className="font-mono"
                                />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              Ano
                            </FormLabel>
                            {vehicleDetailsQuery.isLoading ? (
                              <Skeleton className="h-9 w-full" />
                            ) : (
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="2024"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) ||
                                        new Date().getFullYear(),
                                    )
                                  }
                                  min={new Date().getFullYear() - 100}
                                  max={new Date().getFullYear() + 1}
                                  className="font-mono"
                                />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marca</FormLabel>
                            {vehicleDetailsQuery.isLoading ? (
                              <Skeleton className="h-9 w-full" />
                            ) : (
                              <FormControl>
                                <Input placeholder="Toyota" {...field} />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo</FormLabel>
                            {vehicleDetailsQuery.isLoading ? (
                              <Skeleton className="h-9 w-full" />
                            ) : (
                              <FormControl>
                                <Input placeholder="Corolla" {...field} />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Palette className="mr-1 h-4 w-4" />
                              Cor
                            </FormLabel>
                            {vehicleDetailsQuery.isLoading ? (
                              <Skeleton className="h-9 w-full" />
                            ) : (
                              <FormControl>
                                <Input placeholder="Branco" {...field} />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Combustível</FormLabel>
                            {vehicleDetailsQuery.isLoading ? (
                              <Skeleton className="h-9 w-full" />
                            ) : (
                              <Select
                                onValueChange={(value) => {
                                  if (value) field.onChange(value as FuelType);
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de combustível" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fuelTypeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="chassisNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Hash className="mr-1 h-4 w-4" />
                            Número do Chassi
                          </FormLabel>
                          {vehicleDetailsQuery.isLoading ? (
                            <Skeleton className="h-9 w-full" />
                          ) : (
                            <FormControl>
                              <Input
                                placeholder="9BWZZZZ377VT004251"
                                {...field}
                                className="font-mono"
                                maxLength={17}
                              />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Gauge className="mr-1 h-4 w-4" />
                            Quilometragem (opcional)
                          </FormLabel>
                          {vehicleDetailsQuery.isLoading ? (
                            <Skeleton className="h-9 w-full" />
                          ) : (
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50000"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Informações do Proprietário */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Informações do Proprietário
                    </CardTitle>
                    <CardDescription>
                      Dados do proprietário do veículo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="proprietary.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="mr-1 h-4 w-4" />
                            Nome Completo
                          </FormLabel>
                          {vehicleDetailsQuery.isLoading ? (
                            <Skeleton className="h-9 w-full" />
                          ) : (
                            <FormControl>
                              <Input placeholder="João da Silva" {...field} />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="proprietary.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            E-mail
                          </FormLabel>
                          {vehicleDetailsQuery.isLoading ? (
                            <Skeleton className="h-9 w-full" />
                          ) : (
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="joao@email.com"
                                {...field}
                              />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Preview do veículo */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Preview das Alterações
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Placa:</span>
                          <Badge variant="outline" className="font-mono">
                            {form.watch("plate") || "ABC-1234"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Veículo:</span>
                          <span>
                            {form.watch("brand") || "Marca"}{" "}
                            {form.watch("model") || "Modelo"} (
                            {form.watch("year") || "Ano"})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Proprietário:</span>
                          <span>
                            {form.watch("proprietary.name") || "Nome"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/veiculos">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="min-w-[120px]">
                  Atualizar Veículo
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
