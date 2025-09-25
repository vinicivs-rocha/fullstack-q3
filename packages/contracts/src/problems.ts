import { z } from "zod";

export const ProblemsListResponseSchema = z.array(z.object({
  id: z.number(),
  label: z.string(),
}));

export type ProblemsListResponse = z.infer<typeof ProblemsListResponseSchema>;