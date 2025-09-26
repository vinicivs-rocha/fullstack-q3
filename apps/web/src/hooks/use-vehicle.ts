import { useQuery } from "@tanstack/react-query";
import { VehicleService } from "@/services/vehicle.service";
import { container } from "@/lib/di-container";
import { TYPES } from "@/lib/di-types";
import { VehiclePaginatedListFiltersSchema, VehicleStatus } from "@fullstack-q3/contracts";
import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useParams } from "next/navigation";

export const useVehicle = (
    vehicleService: VehicleService = container.get(TYPES.VehicleService),
) => {
  const { id } = useParams();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [status, setStatus] = useState<VehicleStatus | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(undefined);
  const [vehicleId, setVehicleId] = useState<number | undefined>(id ? parseInt(id as string) : undefined);
  const [isDetailing, setIsDetailing] = useState(false);

  const vehiclesYearsQuery = useQuery({
    queryKey: ['vehicles-years'],
    queryFn: () => vehicleService.listYears(),
  });

  const vehiclesBrandsQuery = useQuery({
    queryKey: ['vehicles-brands'],
    queryFn: () => vehicleService.listBrands(),
  });

  const vehiclesCountsQuery = useQuery({
    queryKey: ['vehicles-counts'],
    queryFn: () => vehicleService.getCounts(),
  });

  const vehiclesPaginatedListQuery = useQuery({
    queryKey: ['vehicles-paginated-list', pagination, status, year, brand, debouncedSearch],
    queryFn: () => vehicleService.paginatedList(VehiclePaginatedListFiltersSchema.parse({ page: pagination.pageIndex + 1, limit: pagination.pageSize, status, year, brand, search: debouncedSearch })),
  });

  const vehicleDetailsQuery = useQuery({
    queryKey: ['vehicle-detail', vehicleId],
    queryFn: () => vehicleService.detail(vehicleId!),
    enabled: !!vehicleId,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 750);
    return () => clearTimeout(timer);
  }, [search]);

  return {
    vehiclesYearsQuery,
    vehiclesBrandsQuery,
    vehiclesCountsQuery,
    vehiclesPaginatedListQuery,
    pagination,
    onPaginationChange: (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        setPagination(newPagination);
      } else {
        setPagination(updaterOrValue);
      }
    },
    vehicleDetailsQuery,
    isDetailing,
    detail: (id: number) => {
      setVehicleId(id);
      setIsDetailing(true);
    },
    stopDetailing: () => {
      setIsDetailing(false);
      setTimeout(() => {
        setVehicleId(undefined);
      }, 250);
    },
    status,
    setStatus,
    year,
    setYear,
    brand,
    setBrand,
    search,
    setSearch,
  };
};