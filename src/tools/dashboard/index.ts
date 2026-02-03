import type { ToolDefinition } from '@src/tools/registry';
import { copyDashboardDefinition } from './copy-dashboard';
import { createDashboardDefinition } from './create-dashboard';
import { deleteDashboardDefinition } from './delete-dashboard';
import { getDashboardDefinition } from './get-dashboard';
import { getDashboardMetadataDefinition } from './get-dashboard-metadata';
import { listDashboardsDefinition } from './list-dashboards';
import { updateDashboardDefinition } from './update-dashboard';

// Dashcard Management (v0.49+)
import { addDashboardCardDefinition } from './add-dashboard-card';
import { removeDashboardCardDefinition } from './remove-dashboard-card';
import { updateDashboardCardDefinition } from './update-dashboard-card';
import { updateDashboardCardsDefinition } from './update-dashboard-cards';

// Tab Management (v0.49+)
import { addDashboardTabDefinition } from './add-dashboard-tab';
import { removeDashboardTabDefinition } from './remove-dashboard-tab';
import { updateDashboardTabDefinition } from './update-dashboard-tab';

// Public Sharing
import { createDashboardPublicLinkDefinition } from './create-dashboard-public-link';
import { deleteDashboardPublicLinkDefinition } from './delete-dashboard-public-link';
import { listPublicDashboardsDefinition } from './list-public-dashboards';

// Favorites
import { addDashboardFavoriteDefinition } from './add-dashboard-favorite';
import { removeDashboardFavoriteDefinition } from './remove-dashboard-favorite';

// Revisions
import { listDashboardRevisionsDefinition } from './list-dashboard-revisions';
import { revertDashboardDefinition } from './revert-dashboard';

// Subscriptions (v0.49+)
import { createDashboardSubscriptionDefinition } from './create-dashboard-subscription';
import { deleteDashboardSubscriptionDefinition } from './delete-dashboard-subscription';
import { listDashboardSubscriptionsDefinition } from './list-dashboard-subscriptions';
import { updateDashboardSubscriptionDefinition } from './update-dashboard-subscription';

/**
 * All dashboard-related tool definitions
 */
export const dashboardTools: ToolDefinition<unknown>[] = [
  // Core Dashboard Operations
  listDashboardsDefinition,
  getDashboardDefinition,
  createDashboardDefinition,
  updateDashboardDefinition,
  deleteDashboardDefinition,
  copyDashboardDefinition,
  getDashboardMetadataDefinition,

  // Dashcard Management (v0.49+)
  addDashboardCardDefinition,
  updateDashboardCardDefinition,
  removeDashboardCardDefinition,
  updateDashboardCardsDefinition,

  // Tab Management (v0.49+)
  addDashboardTabDefinition,
  updateDashboardTabDefinition,
  removeDashboardTabDefinition,

  // Public Sharing
  createDashboardPublicLinkDefinition,
  deleteDashboardPublicLinkDefinition,
  listPublicDashboardsDefinition,

  // Favorites
  addDashboardFavoriteDefinition,
  removeDashboardFavoriteDefinition,

  // Revisions
  listDashboardRevisionsDefinition,
  revertDashboardDefinition,

  // Subscriptions (v0.49+)
  listDashboardSubscriptionsDefinition,
  createDashboardSubscriptionDefinition,
  updateDashboardSubscriptionDefinition,
  deleteDashboardSubscriptionDefinition,
];
