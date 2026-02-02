import type { ToolDefinition } from '@src/tools/registry';
import { copyDashboardDefinition } from './copy-dashboard';
import { createDashboardDefinition } from './create-dashboard';
import { deleteDashboardDefinition } from './delete-dashboard';
import { getDashboardDefinition } from './get-dashboard';
import { getDashboardMetadataDefinition } from './get-dashboard-metadata';
import { listDashboardsDefinition } from './list-dashboards';
import { updateDashboardDefinition } from './update-dashboard';

/**
 * All dashboard-related tool definitions
 */
export const dashboardTools: ToolDefinition<unknown>[] = [
  listDashboardsDefinition,
  getDashboardDefinition,
  createDashboardDefinition,
  updateDashboardDefinition,
  deleteDashboardDefinition,
  copyDashboardDefinition,
  getDashboardMetadataDefinition,
];
