import { z } from 'zod';

export const ListRevisionsParamsSchema = z.object({
  entity: z
    .string()
    .optional()
    .describe('Entity type to filter revisions by (e.g., "dashboard", "card")'),
  id: z.number().int().positive().optional().describe('Entity ID to filter revisions by'),
});
export type ListRevisionsParams = z.infer<typeof ListRevisionsParamsSchema>;

export const RevertRevisionInputSchema = z.object({
  entity: z
    .string()
    .describe('Entity type to revert (e.g., "dashboard", "card")'),
  id: z.number().int().positive().describe('Entity ID to revert'),
  revision_id: z.number().int().positive().describe('Revision ID to revert to'),
});
export type RevertRevisionInput = z.infer<typeof RevertRevisionInputSchema>;
