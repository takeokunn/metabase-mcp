import type { ToolDefinition } from '@src/tools/registry';
import { createLogAdjustmentDefinition } from './create-log-adjustment';
import { deleteLogAdjustmentDefinition } from './delete-log-adjustment';
import { getLogsDefinition } from './get-logs';
import { listLogPresetsDefinition } from './list-log-presets';

export const loggerTools: ToolDefinition<unknown>[] = [
  getLogsDefinition,
  createLogAdjustmentDefinition,
  deleteLogAdjustmentDefinition,
  listLogPresetsDefinition,
];
