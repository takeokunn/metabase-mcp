import { z } from 'zod';

// Get GeoJSON params schema
export const GetGeoJSONParamsSchema = z.object({
  key: z.string().describe('GeoJSON file key identifier'),
});

// Inferred types
export type GetGeoJSONParams = z.infer<typeof GetGeoJSONParamsSchema>;
