import { z } from 'zod';

export const GetCardMapTileParamsSchema = z.object({
  zoom: z.number().int().nonnegative().describe('Map zoom level'),
  x: z.number().int().nonnegative().describe('Tile X coordinate'),
  y: z.number().int().nonnegative().describe('Tile Y coordinate'),
  lat_field: z.string().describe('Latitude field reference'),
  lon_field: z.string().describe('Longitude field reference'),
  card_id: z.number().int().positive().describe('ID of the card to render on the map tile'),
  query: z.string().optional().describe('Optional query parameters as a JSON string'),
});
export type GetCardMapTileParams = z.infer<typeof GetCardMapTileParamsSchema>;

export const GetFieldMapTileParamsSchema = z.object({
  zoom: z.number().int().nonnegative().describe('Map zoom level'),
  x: z.number().int().nonnegative().describe('Tile X coordinate'),
  y: z.number().int().nonnegative().describe('Tile Y coordinate'),
  lat_field_id: z.number().int().positive().describe('ID of the latitude field'),
  lon_field_id: z.number().int().positive().describe('ID of the longitude field'),
});
export type GetFieldMapTileParams = z.infer<typeof GetFieldMapTileParamsSchema>;

export const GetTableMapTileParamsSchema = z.object({
  zoom: z.number().int().nonnegative().describe('Map zoom level'),
  x: z.number().int().nonnegative().describe('Tile X coordinate'),
  y: z.number().int().nonnegative().describe('Tile Y coordinate'),
  card_id: z.number().int().positive().optional().describe('Optional card ID to filter map data'),
});
export type GetTableMapTileParams = z.infer<typeof GetTableMapTileParamsSchema>;

export const GetCardTileInputSchema = z.object({
  card_id: z.number().describe('Card ID'),
  zoom: z.number().describe('Zoom level'),
  x: z.number().describe('Tile X coordinate'),
  y: z.number().describe('Tile Y coordinate'),
});
export type GetCardTileInput = z.infer<typeof GetCardTileInputSchema>;

export const GetDashboardTileInputSchema = z.object({
  dashboard_id: z.number().describe('Dashboard ID'),
  dashcard_id: z.number().describe('Dashboard card ID'),
  card_id: z.number().describe('Card ID'),
  zoom: z.number().describe('Zoom level'),
  x: z.number().describe('Tile X coordinate'),
  y: z.number().describe('Tile Y coordinate'),
});
export type GetDashboardTileInput = z.infer<typeof GetDashboardTileInputSchema>;

export const GetFieldTileInputSchema = z.object({
  zoom: z.number().describe('Zoom level'),
  x: z.number().describe('Tile X coordinate'),
  y: z.number().describe('Tile Y coordinate'),
  lat_field_id: z.number().describe('Latitude field ID'),
  lon_field_id: z.number().describe('Longitude field ID'),
  field_id: z.number().describe('Field ID'),
  timeseries_enabled: z.boolean().describe('Whether timeseries is enabled'),
  token: z.string().describe('Authentication token'),
});
export type GetFieldTileInput = z.infer<typeof GetFieldTileInputSchema>;
