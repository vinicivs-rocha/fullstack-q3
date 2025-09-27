import { z } from "zod";

export const SurveyorListResponseSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
}));

export type SurveyorListResponse = z.infer<typeof SurveyorListResponseSchema>;