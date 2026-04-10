import { z } from 'zod';
import { IdSchema } from './common';

export const ActionIdSchema = IdSchema;

export const ActionTypeSchema = z.enum(['query', 'implicit', 'http']).describe('Type of action');

export const ActionSchema = z.object({
  id: ActionIdSchema.describe('Action ID'),
  name: z.string().min(1).describe('Action display name'),
  description: z.string().nullable().optional().describe('Action description'),
  type: ActionTypeSchema,
  model_id: z.number().int().positive().describe('ID of the model (card) this action belongs to'),
  parameters: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Action parameter definitions'),
  visualization_settings: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Visualization settings'),
  archived: z.boolean().optional().describe('Whether the action is archived'),
  created_at: z.string().datetime().optional().describe('Creation timestamp'),
  updated_at: z.string().datetime().optional().describe('Last update timestamp'),
});

export const ListActionsParamsSchema = z.object({
  model_id: z.number().int().positive().optional().describe('Filter actions by model (card) ID'),
});

export const GetActionParamsSchema = z.object({
  id: ActionIdSchema.describe('Action ID'),
});

export const CreateActionInputSchema = z.object({
  name: z.string().min(1).describe('Action display name'),
  type: ActionTypeSchema,
  model_id: z.number().int().positive().describe('ID of the model (card) this action belongs to'),
  description: z.string().optional().describe('Action description'),
  parameters: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Action parameter definitions'),
  template: z.record(z.string(), z.unknown()).optional().describe('Template for HTTP actions'),
  visualization_settings: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Visualization settings'),
});

export const UpdateActionInputSchema = z.object({
  id: ActionIdSchema.describe('Action ID to update'),
  name: z.string().min(1).optional().describe('New action display name'),
  description: z.string().optional().describe('Action description'),
  type: ActionTypeSchema.optional(),
  parameters: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Action parameter definitions'),
  template: z.record(z.string(), z.unknown()).optional().describe('Template for HTTP actions'),
  visualization_settings: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Updated visualization settings'),
  archived: z.boolean().optional().describe('Whether to archive the action'),
});

export const DeleteActionParamsSchema = z.object({
  id: ActionIdSchema.describe('Action ID to delete'),
});

export const GetActionExecuteFormParamsSchema = z.object({
  id: ActionIdSchema.describe('Action ID to get the execute form for'),
});

export const ExecuteActionInputSchema = z.object({
  id: ActionIdSchema.describe('Action ID to execute'),
  parameters: z
    .record(z.string(), z.unknown())
    .describe('Key-value map of parameter values for the action'),
});

export const CreateActionPublicLinkParamsSchema = z.object({
  id: ActionIdSchema.describe('Action ID to create a public link for'),
});

export const DeleteActionPublicLinkParamsSchema = z.object({
  id: ActionIdSchema.describe('Action ID to delete the public link from'),
});

export type ActionId = z.infer<typeof ActionIdSchema>;
export type ActionType = z.infer<typeof ActionTypeSchema>;
export type Action = z.infer<typeof ActionSchema>;
export type ListActionsParams = z.infer<typeof ListActionsParamsSchema>;
export type GetActionParams = z.infer<typeof GetActionParamsSchema>;
export type CreateActionInput = z.infer<typeof CreateActionInputSchema>;
export type UpdateActionInput = z.infer<typeof UpdateActionInputSchema>;
export type DeleteActionParams = z.infer<typeof DeleteActionParamsSchema>;
export type GetActionExecuteFormParams = z.infer<typeof GetActionExecuteFormParamsSchema>;
export type ExecuteActionInput = z.infer<typeof ExecuteActionInputSchema>;
export type CreateActionPublicLinkParams = z.infer<typeof CreateActionPublicLinkParamsSchema>;
export type DeleteActionPublicLinkParams = z.infer<typeof DeleteActionPublicLinkParamsSchema>;
