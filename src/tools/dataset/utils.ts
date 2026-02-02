import type { ExecuteQueryInput } from '@src/schemas/dataset';

/**
 * Build the request body for dataset query API calls
 */
export function buildDatasetQueryBody(input: ExecuteQueryInput) {
  return {
    database: input.database,
    type: input.type,
    ...(input.type === 'query' && input.query ? { query: input.query } : {}),
    ...(input.type === 'native' && input.native ? { native: input.native } : {}),
  };
}
