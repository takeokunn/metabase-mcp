import type { ToolDefinition } from '@src/tools/registry';
// Dashcard Management (v0.49+)
import { addDashboardCardDefinition } from './add-dashboard-card';
// Tab Management (v0.49+)
import { addDashboardTabDefinition } from './add-dashboard-tab';
import { copyDashboardDefinition } from './copy-dashboard';
import { createDashboardDefinition } from './create-dashboard';
// Public Sharing
import { createDashboardPublicLinkDefinition } from './create-dashboard-public-link';
// Subscriptions (v0.49+)
import { createDashboardSubscriptionDefinition } from './create-dashboard-subscription';
import { deleteDashboardDefinition } from './delete-dashboard';
import { deleteDashboardPublicLinkDefinition } from './delete-dashboard-public-link';
import { deleteDashboardSubscriptionDefinition } from './delete-dashboard-subscription';
import { getDashboardDefinition } from './get-dashboard';
import { getDashboardMetadataDefinition } from './get-dashboard-metadata';
// Revisions
import { listDashboardRevisionsDefinition } from './list-dashboard-revisions';
import { listDashboardSubscriptionsDefinition } from './list-dashboard-subscriptions';
import { listDashboardsDefinition } from './list-dashboards';
import { listPublicDashboardsDefinition } from './list-public-dashboards';
import { removeDashboardCardDefinition } from './remove-dashboard-card';
import { removeDashboardTabDefinition } from './remove-dashboard-tab';
import { revertDashboardDefinition } from './revert-dashboard';
import { updateDashboardDefinition } from './update-dashboard';
import { updateDashboardCardDefinition } from './update-dashboard-card';
import { updateDashboardCardsDefinition } from './update-dashboard-cards';
import { updateDashboardSubscriptionDefinition } from './update-dashboard-subscription';
import { updateDashboardTabDefinition } from './update-dashboard-tab';
// Query Execution & Export
import { executeDashboardCardQueryDefinition } from './execute-dashboard-card-query';
import { exportDashboardCardQueryDefinition } from './export-dashboard-card-query';
import { getDashboardParamValuesDefinition } from './get-dashboard-param-values';
import { searchDashboardParamValuesDefinition } from './search-dashboard-param-values';
import { getDashboardEmbeddableDefinition } from './get-dashboard-embeddable';
import { getDashboardParamRemappingDefinition } from './get-dashboard-param-remapping';
import { getDashboardRelatedDefinition } from './get-dashboard-related';
import { getValidFilterFieldsDefinition } from './get-valid-filter-fields';
import { saveDashboardDefinition } from './save-dashboard';
import { saveDashboardToCollectionDefinition } from './save-dashboard-to-collection';
import { getDashboardItemsDefinition } from './get-dashboard-items';
import { getDashcardActionParamsDefinition } from './get-dashcard-action-params';
import { runDashcardQueryDefinition } from './run-dashcard-query';
import { exportDashcardQueryDefinition } from './export-dashcard-query';
import { executeDashcardActionDefinition } from './execute-dashcard-action';
import { pivotDashcardQueryDefinition } from './pivot-dashcard-query';

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

  // Revisions
  listDashboardRevisionsDefinition,
  revertDashboardDefinition,

  // Subscriptions (v0.49+)
  listDashboardSubscriptionsDefinition,
  createDashboardSubscriptionDefinition,
  updateDashboardSubscriptionDefinition,
  deleteDashboardSubscriptionDefinition,

  // Query Execution & Export
  executeDashboardCardQueryDefinition,
  exportDashboardCardQueryDefinition,
  getDashboardParamValuesDefinition,
  searchDashboardParamValuesDefinition,
  getDashboardEmbeddableDefinition,
  getDashboardParamRemappingDefinition,
  getDashboardRelatedDefinition,
  getValidFilterFieldsDefinition,
  saveDashboardDefinition,
  saveDashboardToCollectionDefinition,
  getDashboardItemsDefinition,
  getDashcardActionParamsDefinition,
  runDashcardQueryDefinition,
  exportDashcardQueryDefinition,
  executeDashcardActionDefinition,
  pivotDashcardQueryDefinition,
];
