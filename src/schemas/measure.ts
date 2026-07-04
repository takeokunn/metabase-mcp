import { z } from 'zod';
export const ListMeasuresInputSchema = z.object({});
export type ListMeasuresInput = z.infer<typeof ListMeasuresInputSchema>;
export const GetMeasureInputSchema = z.object({ id: z.number().describe('Measure ID') });
export type GetMeasureInput = z.infer<typeof GetMeasureInputSchema>;
export const CreateMeasureInputSchema = z.object({
  name: z.string().describe('Measure name'),
  definition: z.record(z.string(), z.unknown()).describe('Measure definition'),
});
export type CreateMeasureInput = z.infer<typeof CreateMeasureInputSchema>;
export const UpdateMeasureInputSchema = z.object({
  id: z.number().describe('Measure ID'),
  name: z.string().optional().describe('Measure name'),
  definition: z.record(z.string(), z.unknown()).optional().describe('Measure definition'),
});
export type UpdateMeasureInput = z.infer<typeof UpdateMeasureInputSchema>;
export const GetMeasureDimensionValuesParamsSchema = z.object({
  id: z.number().describe('Measure ID'),
  dimension_key: z.string().describe('Dimension key of the measure'),
});
export type GetMeasureDimensionValuesParams = z.infer<typeof GetMeasureDimensionValuesParamsSchema>;
export const SearchMeasureDimensionValuesParamsSchema = z.object({
  id: z.number().describe('Measure ID'),
  dimension_key: z.string().describe('Dimension key of the measure'),
  query: z.string().describe('Search query string'),
});
export type SearchMeasureDimensionValuesParams = z.infer<
  typeof SearchMeasureDimensionValuesParamsSchema
>;
export const GetMeasureDimensionRemappingParamsSchema = z.object({
  id: z.number().describe('Measure ID'),
  dimension_key: z.string().describe('Dimension key of the measure'),
  value: z.string().describe('Value to remap'),
});
export type GetMeasureDimensionRemappingParams = z.infer<
  typeof GetMeasureDimensionRemappingParamsSchema
>;
