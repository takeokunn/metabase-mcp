import type { ToolDefinition } from '@src/tools/registry';
import { createChannelDefinition } from './create-channel';
import { getChannelDefinition } from './get-channel';
import { listChannelsDefinition } from './list-channels';
import { testChannelDefinition } from './test-channel';
import { updateChannelDefinition } from './update-channel';

/**
 * All channel-related tool definitions
 */
export const channelTools: ToolDefinition<unknown>[] = [
  listChannelsDefinition,
  getChannelDefinition,
  createChannelDefinition,
  updateChannelDefinition,
  testChannelDefinition,
];
