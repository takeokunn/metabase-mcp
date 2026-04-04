import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getBugReportingDetailsDefinition: ToolDefinition = {
  name: 'get_bug_reporting_details',
  description: 'Get bug reporting details and diagnostic information from Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/bug-reporting/details');
    return formatToolResponse(result);
  },
};
