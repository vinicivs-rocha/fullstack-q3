import { z } from "zod";

export const VehicleListResponseSchema = z.array(z.object({
  id: z.number(),
  plate: z.string(),
  model: z.string(),
  brand: z.string(),
  year: z.number(),
}));

export type VehicleListResponse = z.infer<typeof VehicleListResponseSchema>;