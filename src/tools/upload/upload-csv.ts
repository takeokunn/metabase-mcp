import type { MetabaseClient } from '@src/client';
import { type UploadCsvInput, UploadCsvInputSchema } from '@src/schemas/upload';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const uploadCsvDefinition: ToolDefinition<UploadCsvInput> = {
  name: 'upload_csv',
  description: 'Upload a CSV file to create a new table in Metabase',
  inputSchema: UploadCsvInputSchema,
  handler: async (client: MetabaseClient, input: UploadCsvInput) => {
    const result = await client.post('/api/upload/csv', input);
    return formatToolResponse(result);
  },
};
