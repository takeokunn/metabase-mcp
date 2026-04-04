import type { ToolDefinition } from '@src/tools/registry';
import { deleteAlertSubscriptionDefinition } from './delete-alert-subscription';
import { getAlertDefinition } from './get-alert';
import { listAlertsDefinition } from './list-alerts';

export const alertTools: ToolDefinition<unknown>[] = [
  listAlertsDefinition,
  getAlertDefinition,
  deleteAlertSubscriptionDefinition,
];
