import { z } from 'zod';

// Generate random token input schema (no params)
export const GenerateRandomTokenInputSchema = z.object({});

// Inferred types
export type GenerateRandomTokenInput = z.infer<typeof GenerateRandomTokenInputSchema>;
