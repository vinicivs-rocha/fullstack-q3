import { z } from "zod";
import { InvoiceStatusSchema } from "./invoices";

export const ReportsFiltersSchema = z.object({
  start: z.date(),
  end: z.date(),
  surveyorId: z.number().optional(),
});

export const InvoicesAggregationStatsSchema = z.object({
  total: z.object({
    count: z.number(),
    variationPercentage: z.number().optional(),
  }),
  approvalRate: z.object({
    valuePercentage: z.number(),
    variationPercentage: z.number().optional(),
  }),
  averageDuration: z.object({
    minutes: z.number(),
    variationMinutes: z.number().optional(),
  }),
  totalReceipt: z.object({
    sum: z.number(),
    variationPercentage: z.number().optional(),
  }),
});

export const InvoicesDailyCountSchema = z.array(z.object({
  date: z.date(),
  count: z.number(),
}));

export const InvoicesStatusCountSchema = z.array(z.object({
  status: InvoiceStatusSchema,
  count: z.number(),
}));

export const SurveyorsInvoiceAggregationStatsSchema = z.array(z.object({
  surveyor: z.object({
    id: z.number(),
    name: z.string(),
    gender: z.enum(["M", "F"]),
  }),
  total: z.number(),
  approvalRate: z.number(),
  durationMean: z.number(),
  totalReceipt: z.number(),
}));

export const ProblemsIncidenceRateSchema = z.array(z.object({
  problemName: z.string(),
  rate: z.number(),
}));

export const BrandsInvoiceCountSchema = z.array(z.object({
  brand: z.string(),
  count: z.number(),
}));

export type ReportsFilters = z.infer<typeof ReportsFiltersSchema>;
export type InvoicesAggregationStats = z.infer<typeof InvoicesAggregationStatsSchema>;
export type InvoicesDailyCount = z.infer<typeof InvoicesDailyCountSchema>;
export type InvoicesStatusCount = z.infer<typeof InvoicesStatusCountSchema>;
export type SurveyorsInvoiceAggregationStats = z.infer<typeof SurveyorsInvoiceAggregationStatsSchema>;
export type ProblemsIncidenceRate = z.infer<typeof ProblemsIncidenceRateSchema>;
export type BrandsInvoiceCount = z.infer<typeof BrandsInvoiceCountSchema>;