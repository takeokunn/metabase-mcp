import { z } from 'zod';

export const GetLogsParamsSchema = z.object({
  level: z
    .string()
    .optional()
    .describe('Log level filter (e.g., "ERROR", "WARN", "INFO", "DEBUG")'),
  namespace: z.string().optional().describe('Logger namespace filter'),
  last_n_lines: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Number of recent log lines to return'),
});
export type GetLogsParams = z.infer<typeof GetLogsParamsSchema>;

export const CreateLogAdjustmentInputSchema = z.object({
  logger: z.string().describe('Logger name/namespace to adjust'),
  level: z.string().describe('Log level to set (e.g., "DEBUG", "INFO")'),
  duration_ms: z
    .number()
    .int()
    .positive()
    .describe('How long to apply the adjustment in milliseconds'),
});
export type CreateLogAdjustmentInput = z.infer<typeof CreateLogAdjustmentInputSchema>;
