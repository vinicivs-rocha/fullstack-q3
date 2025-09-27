"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { BrandsInvoiceCount } from "@fullstack-q3/contracts";

interface BrandsListProps {
  data: BrandsInvoiceCount;
  isLoading?: boolean;
}

export function BrandsList({ data, isLoading = false }: BrandsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marcas Mais Vistoriadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marcas Mais Vistoriadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Car className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">Nenhuma vistoria encontrada</p>
            <p className="text-gray-400 text-xs mt-1">
              Tente ajustar os filtros
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marcas Mais Vistoriadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((brand, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{brand.brand}</span>
              </div>
              <span className="text-sm font-medium">
                {brand.count} vistorias
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
