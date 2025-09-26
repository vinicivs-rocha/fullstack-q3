import { z } from "zod";

export const VehicleStatusSchema = z.enum(["ATIVO", "PENDENTE", "INATIVO"]);

export const VehicleYearsResponseSchema = z.array(z.number());

export const VehicleBrandsResponseSchema = z.array(z.string());

export const VehicleCountsResponseSchema = z.object({
  total: z.number(),
  active: z.number(),
  pending: z.number(),
  inactive: z.number(),
});

export const VehicleListResponseSchema = z.array(z.object({
  id: z.number(),
  plate: z.string(),
  model: z.string(),
  brand: z.string(),
  year: z.number(),
  chassisNumber: z.string(),
  proprietary: z.object({
    name: z.string(),
    email: z.email(),
  }),
  createdAt: z.coerce.date(),
  lastSurveyDate: z.coerce.date().optional(),
  status: VehicleStatusSchema,
}));

export const VehiclePaginatedListFiltersSchema = z.object({
  status: VehicleStatusSchema.optional(),
  year: z.number().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export const VehiclePaginatedListResponseSchema = z.object({
  vehicles: VehicleListResponseSchema,
  total: z.number(),
});

export const VehicleDetailsResponseSchema = z.object({
  id: z.number(),
  plate: z.string(),
  model: z.string(),
  brand: z.string(),
  year: z.number(),
  color: z.string(),
  fuelType: z.string(),
  mileage: z.number().optional(),
  chassisNumber: z.string(),
  proprietary: z.object({
    name: z.string(),
    email: z.string(),
  }),
  createdAt: z.string(),
  invoices: z.array(z.object({
    id: z.number(),
    status: z.string(),
    createdAt: z.string(),
    price: z.number(),
  })),
});

export type VehicleStatus = z.infer<typeof VehicleStatusSchema>;
export type VehicleListResponse = z.infer<typeof VehicleListResponseSchema>;
export type VehicleCountsResponse = z.infer<typeof VehicleCountsResponseSchema>;
export type VehicleBrandsResponse = z.infer<typeof VehicleBrandsResponseSchema>;
export type VehicleYearsResponse = z.infer<typeof VehicleYearsResponseSchema>;
export type VehiclePaginatedListResponse = z.infer<
  typeof VehiclePaginatedListResponseSchema
>;
export type VehiclePaginatedListFilters = z.infer<
  typeof VehiclePaginatedListFiltersSchema
>;
export type VehicleDetailsResponse = z.infer<typeof VehicleDetailsResponseSchema>;