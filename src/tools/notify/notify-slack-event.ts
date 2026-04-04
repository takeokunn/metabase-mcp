import type { MetabaseClient } from '@src/client';
import {
  type NotifySlackEventInput,
  NotifySlackEventInputSchema,
} from '@src/schemas/notify';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for handling Slack events for Metabot
 */
export const notifySlackEventDefinition: ToolDefinition<NotifySlackEventInput> = {
  name: 'notify_slack_event',
  description:
    'Handle an incoming Slack event for Metabot integration. Accepts the raw Slack event payload and forwards it to Metabase for processing.',
  inputSchema: NotifySlackEventInputSchema,
  handler: async (client: MetabaseClient, input: NotifySlackEventInput) => {
    const result = await client.post('/api/notify/slack', input);
    return formatToolResponse(result);
  },
};
