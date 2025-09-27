import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VehicleService } from "@/services/vehicle.service";
import { container } from "@/lib/di-container";
import { TYPES } from "@/lib/di-types";
import {
  VehicleBrandsFiltersSchema,
  VehicleCreationData,
  VehicleCreationDataSchema,
  VehiclePaginatedListFiltersSchema,
  VehicleStatus,
  VehicleUpdatingData,
  VehicleUpdatingDataSchema,
  VehicleYearsFiltersSchema,
} from "@fullstack-q3/contracts";
import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export const useVehicle = (
  vehicleService: VehicleService = container.get(TYPES.VehicleService),
) => {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [status, setStatus] = useState<VehicleStatus | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
    undefined,
  );
  const [vehicleId, setVehicleId] = useState<number | undefined>(
    id ? parseInt(id as string) : undefined,
  );
  const [isDetailing, setIsDetailing] = useState(false);

  const vehiclesYearsQuery = useQuery({
    queryKey: ["vehicles-years", status, brand],
    queryFn: () =>
      vehicleService.listYears(
        VehicleYearsFiltersSchema.parse({
          status,
          brand,
        }),
      ),
  });

  const vehiclesBrandsQuery = useQuery({
    queryKey: ["vehicles-brands", status, year],
    queryFn: () =>
      vehicleService.listBrands(
        VehicleBrandsFiltersSchema.parse({
          status,
          year,
        }),
      ),
  });

  const vehiclesCountsQuery = useQuery({
    queryKey: ["vehicles-counts"],
    queryFn: () => vehicleService.getCounts(),
  });

  const vehiclesPaginatedListQuery = useQuery({
    queryKey: [
      "vehicles-paginated-list",
      pagination,
      status,
      year,
      brand,
      debouncedSearch,
    ],
    queryFn: () =>
      vehicleService.paginatedList(
        VehiclePaginatedListFiltersSchema.parse({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          status,
          year,
          brand,
          search: debouncedSearch,
        }),
      ),
  });

  const vehicleDetailsQuery = useQuery({
    queryKey: ["vehicle-detail", vehicleId],
    queryFn: () => vehicleService.detail(vehicleId!),
    enabled: !!vehicleId,
  });

  const vehicleCreateMutation = useMutation({
    mutationKey: ["vehicle-create"],
    mutationFn: (vehicle: VehicleCreationData) =>
      vehicleService.create(VehicleCreationDataSchema.parse(vehicle)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles-paginated-list"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-counts"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-years"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-brands"] });
      toast.success("Veículo criado com sucesso");
      router.push("/veiculos");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao criar veículo");
    },
  });

  const vehicleUpdateMutation = useMutation({
    mutationKey: ["vehicle-update"],
    mutationFn: ({ id, ...vehicle }: VehicleUpdatingData & { id: number }) =>
      vehicleService.update(id, VehicleUpdatingDataSchema.parse(vehicle)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles-paginated-list"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-counts"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-years"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-brands"] });
      toast.success("Veículo atualizado com sucesso");
      router.push("/veiculos");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar veículo");
    },
  });

  const vehicleDeleteMutation = useMutation({
    mutationKey: ["vehicle-delete"],
    mutationFn: (id: number) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles-paginated-list"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-counts"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-years"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles-brands"] });
      toast.success("Veículo deletado com sucesso");
      router.push("/veiculos");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao deletar veículo");
    },
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
    onPaginationChange: (
      updaterOrValue:
        | PaginationState
        | ((old: PaginationState) => PaginationState),
    ) => {
      if (typeof updaterOrValue === "function") {
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
    create: (vehicle: VehicleCreationData) =>
      vehicleCreateMutation.mutate(vehicle),
    update: (id: number, vehicle: VehicleUpdatingData) =>
      vehicleUpdateMutation.mutate({ id, ...vehicle }),
    delete: (id: number) => vehicleDeleteMutation.mutate(id),
  };
};
