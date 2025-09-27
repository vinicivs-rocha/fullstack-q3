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
