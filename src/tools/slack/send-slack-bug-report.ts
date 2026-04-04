import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const sendSlackBugReportDefinition: ToolDefinition = {
  name: 'send_slack_bug_report',
  description: '[Requires Metabase Pro] Send a bug report via Slack from Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.post('/api/slack/bug-report', {});
    return formatToolResponse(result);
  },
};
