import { z } from 'zod';

// Pagination schemas
export const PaginationParamsSchema = z.object({
  limit: z.number().int().positive().default(100).describe('Maximum number of items to return'),
  offset: z.number().int().nonnegative().default(0).describe('Number of items to skip'),
});

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
    offset: z.number().int().nonnegative(),
  });

// ID schema (positive integer)
export const IdSchema = z.number().int().positive();

// UUID schema (for public links, etc.)
export const UUIDSchema = z.string().uuid().describe('UUID identifier');

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

// Inferred types
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};
export type Id = z.infer<typeof IdSchema>;
export type UUID = z.infer<typeof UUIDSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
