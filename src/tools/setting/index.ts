import type { ToolDefinition } from '@src/tools/registry';
import { bulkUpdateSettingsDefinition } from './bulk-update-settings';
import { getSettingDefinition } from './get-setting';
import { listSettingsDefinition } from './list-settings';
import { updateSettingDefinition } from './update-setting';

/**
 * All setting-related tool definitions
 */
export const settingTools: ToolDefinition<unknown>[] = [
  listSettingsDefinition,
  getSettingDefinition,
  updateSettingDefinition,
  bulkUpdateSettingsDefinition,
];
