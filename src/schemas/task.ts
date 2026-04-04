import { z } from 'zod';
import { IdSchema } from './common';

export const TaskIdSchema = IdSchema;
export const TaskRunIdSchema = IdSchema;

export const GetTaskParamsSchema = z.object({
  id: z.number().int().positive().describe('Task ID'),
});

export const GetTaskRunParamsSchema = z.object({
  id: z.number().int().positive().describe('Task run ID'),
});

export const GetTaskRunEntitiesInputSchema = z.object({});
export type GetTaskRunEntitiesInput = z.infer<typeof GetTaskRunEntitiesInputSchema>;

export type TaskId = z.infer<typeof TaskIdSchema>;
export type TaskRunId = z.infer<typeof TaskRunIdSchema>;
export type GetTaskParams = z.infer<typeof GetTaskParamsSchema>;
export type GetTaskRunParams = z.infer<typeof GetTaskRunParamsSchema>;
