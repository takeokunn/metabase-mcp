import type { ToolDefinition } from '@src/tools/registry';
import { createAlertDefinition } from './create-alert';
import { deleteAlertDefinition } from './delete-alert';
import { getAlertDefinition } from './get-alert';
import { listAlertsDefinition } from './list-alerts';
import { updateAlertDefinition } from './update-alert';

/**
 * All alert-related tool definitions
 */
export const alertTools: ToolDefinition<unknown>[] = [
  listAlertsDefinition,
  getAlertDefinition,
  createAlertDefinition,
  updateAlertDefinition,
  deleteAlertDefinition,
];
