import type { ToolDefinition } from '@src/tools/registry';
import { feedbackMetabotDefinition } from './feedback-metabot';
import { getMetabotSettingsDefinition } from './get-metabot-settings';
import { queryMetabotDefinition } from './query-metabot';
import { updateMetabotSettingsDefinition } from './update-metabot-settings';

export const metabotTools: ToolDefinition<unknown>[] = [
  queryMetabotDefinition,
  feedbackMetabotDefinition,
  getMetabotSettingsDefinition,
  updateMetabotSettingsDefinition,
];
