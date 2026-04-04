import type { ToolDefinition } from '@src/tools/registry';
import { getEmbedCardDefinition } from './get-embed-card';
import { getEmbedCardQueryDefinition } from './get-embed-card-query';
import { getEmbedCardQueryFormatDefinition } from './get-embed-card-query-format';
import { getEmbedDashboardDefinition } from './get-embed-dashboard';
import { getEmbedDashboardQueryDefinition } from './get-embed-dashboard-query';
import { getEmbedDashboardQueryFormatDefinition } from './get-embed-dashboard-query-format';
import { getEmbedDashboardParamsDefinition } from './get-embed-dashboard-params';
import { searchEmbedDashboardParamsDefinition } from './search-embed-dashboard-params';

export const embedTools: ToolDefinition<unknown>[] = [
  getEmbedCardDefinition,
  getEmbedCardQueryDefinition,
  getEmbedCardQueryFormatDefinition,
  getEmbedDashboardDefinition,
  getEmbedDashboardQueryDefinition,
  getEmbedDashboardQueryFormatDefinition,
  getEmbedDashboardParamsDefinition,
  searchEmbedDashboardParamsDefinition,
];
