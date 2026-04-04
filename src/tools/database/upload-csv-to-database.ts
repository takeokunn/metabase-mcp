import type { MetabaseClient } from '@src/client';
import { type UploadCsvToDatabaseInput, UploadCsvToDatabaseInputSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for uploading a CSV to create a new table in a database
 */
export const uploadCsvToDatabaseDefinition: ToolDefinition<UploadCsvToDatabaseInput> = {
  name: 'upload_csv_to_database',
  description: 'Upload a CSV to create a new table in a database in Metabase',
  inputSchema: UploadCsvToDatabaseInputSchema,
  handler: async (client: MetabaseClient, input: UploadCsvToDatabaseInput) => {
    const result = await client.post(`/api/database/${input.id}/csv`, {
      table_name: input.table_name,
      schema_name: input.schema_name,
      collection_id: input.collection_id,
    });
    return formatToolResponse(result);
  },
};
