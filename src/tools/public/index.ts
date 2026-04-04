import type { ToolDefinition } from '@src/tools/registry';
import { getPublicCardDefinition } from './get-public-card';
import { getPublicCardQueryDefinition } from './get-public-card-query';
import { getPublicCardQueryFormatDefinition } from './get-public-card-query-format';
import { getPublicDashboardDefinition } from './get-public-dashboard';
import { getPublicDashboardQueryDefinition } from './get-public-dashboard-query';
import { getPublicDashboardQueryFormatDefinition } from './get-public-dashboard-query-format';
import { getPublicDashboardParamsDefinition } from './get-public-dashboard-params';
import { searchPublicDashboardParamsDefinition } from './search-public-dashboard-params';

export const publicTools: ToolDefinition<unknown>[] = [
  getPublicCardDefinition,
  getPublicCardQueryDefinition,
  getPublicCardQueryFormatDefinition,
  getPublicDashboardDefinition,
  getPublicDashboardQueryDefinition,
  getPublicDashboardQueryFormatDefinition,
  getPublicDashboardParamsDefinition,
  searchPublicDashboardParamsDefinition,
];
