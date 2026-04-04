import type { ToolDefinition } from '@src/tools/registry';
import { exportEmbedCardQueryDefinition } from './export-embed-card-query';
import { exportEmbedDashcardQueryDefinition } from './export-embed-dashcard-query';
import { getEmbedCardDefinition } from './get-embed-card';
import { getEmbedCardParamRemappingDefinition } from './get-embed-card-param-remapping';
import { getEmbedCardParamValuesDefinition } from './get-embed-card-param-values';
import { getEmbedCardQueryDefinition } from './get-embed-card-query';
import { getEmbedCardQueryFormatDefinition } from './get-embed-card-query-format';
import { getEmbedCardTileDefinition } from './get-embed-card-tile';
import { getEmbedDashboardDefinition } from './get-embed-dashboard';
import { getEmbedDashboardParamRemappingDefinition } from './get-embed-dashboard-param-remapping';
import { getEmbedDashboardParamValuesDefinition } from './get-embed-dashboard-param-values';
import { getEmbedDashboardParamsDefinition } from './get-embed-dashboard-params';
import { getEmbedDashboardQueryDefinition } from './get-embed-dashboard-query';
import { getEmbedDashboardQueryFormatDefinition } from './get-embed-dashboard-query-format';
import { getEmbedDashboardTileDefinition } from './get-embed-dashboard-tile';
import { runEmbedCardPivotQueryDefinition } from './run-embed-card-pivot-query';
import { runEmbedDashboardPivotDashcardQueryDefinition } from './run-embed-dashboard-pivot-dashcard-query';
import { runEmbedDashboardPivotQueryDefinition } from './run-embed-dashboard-pivot-query';
import { runEmbedDashcardQueryDefinition } from './run-embed-dashcard-query';
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
  getEmbedCardParamRemappingDefinition,
  getEmbedDashboardParamRemappingDefinition,
  runEmbedDashcardQueryDefinition,
  exportEmbedDashcardQueryDefinition,
  runEmbedDashboardPivotDashcardQueryDefinition,
  getEmbedCardTileDefinition,
  getEmbedDashboardTileDefinition,
];
