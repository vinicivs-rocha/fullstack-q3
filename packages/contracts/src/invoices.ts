import { z } from 'zod';

export const InvoiceStatusSchema = z.enum(["PENDENTE", "APROVADA", "REPROVADA"]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const VehicleSchema = z.object({
  id: z.number(),
  plate: z.string(),
  model: z.string(),
  brand: z.string(),
  year: z.number(),
});

export const InvoiceSchema = z.object({
  id: z.number(),
  vehicle: VehicleSchema,
  createdAt: z.string(),
  surveyor: z.object({
    name: z.string(),
    gender: z.enum(["M", "F"]),
  }),
  status: InvoiceStatusSchema,
});

export const InvoicesFiltersSchema = z.object({
  status: InvoiceStatusSchema.optional(),
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const InvoicesListResponseSchema = z.object({
  invoices: z.array(InvoiceSchema),
  total: z.number(),
});

export const InvoicesStatsSchema = z.object({
  total: z.number(),
  pending: z.number(),
  approved: z.number(),
  rejected: z.number(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoicesFilters = z.infer<typeof InvoicesFiltersSchema>;
export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;
export type InvoicesStats = z.infer<typeof InvoicesStatsSchema>;

export const FuelTypeSchema = z.enum(["GASOLINA", "ETANOL", "FLEX", "DIESEL", "ELETRICO", "HIBRIDO"]);
export type FuelType = z.infer<typeof FuelTypeSchema>;

export const DetailedInvoiceSchema = z.object({
  id: z.number(),
  vehicle: z.object({
    id: z.number(),
    plate: z.string(),
    model: z.string(),
    brand: z.string(),
    year: z.number(),
    color: z.string(),
    chassisNumber: z.string(),
    fuelType: FuelTypeSchema,
    mileage: z.number().optional(),
  }),
  surveyor: z.object({
    id: z.number(),
    name: z.string(),
    gender: z.enum(["M", "F"]),
    email: z.email(),
    phone: z.string(),
    license: z.string(),
  }),
  status: InvoiceStatusSchema,
  createdAt: z.coerce.date(),
  observation: z.string().optional(),
  price: z.number(),
  duration: z.number(),
});

export type DetailedInvoice = z.infer<typeof DetailedInvoiceSchema>;
