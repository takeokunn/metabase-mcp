import type { ToolDefinition } from '@src/tools/registry';
import { executeEmbedDashcardActionDefinition } from './execute-embed-dashcard-action';
import { exportEmbedCardQueryDefinition } from './export-embed-card-query';
import { getEmbedCardDefinition } from './get-embed-card';
import { getEmbedCardParamValuesDefinition } from './get-embed-card-param-values';
import { getEmbedCardQueryDefinition } from './get-embed-card-query';
import { getEmbedCardQueryFormatDefinition } from './get-embed-card-query-format';
import { getEmbedDashboardDefinition } from './get-embed-dashboard';
import { getEmbedDashboardParamValuesDefinition } from './get-embed-dashboard-param-values';
import { getEmbedDashboardParamsDefinition } from './get-embed-dashboard-params';
import { getEmbedDashboardQueryDefinition } from './get-embed-dashboard-query';
import { getEmbedDashboardQueryFormatDefinition } from './get-embed-dashboard-query-format';
import { runEmbedCardPivotQueryDefinition } from './run-embed-card-pivot-query';
import { runEmbedDashboardPivotQueryDefinition } from './run-embed-dashboard-pivot-query';
import { searchEmbedCardParamValuesDefinition } from './search-embed-card-param-values';
import { searchEmbedDashboardParamValuesDefinition } from './search-embed-dashboard-param-values';
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
  getEmbedCardParamValuesDefinition,
  searchEmbedCardParamValuesDefinition,
  exportEmbedCardQueryDefinition,
  getEmbedDashboardParamValuesDefinition,
  searchEmbedDashboardParamValuesDefinition,
  runEmbedCardPivotQueryDefinition,
  runEmbedDashboardPivotQueryDefinition,
  executeEmbedDashcardActionDefinition,
];
