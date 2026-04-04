import type { ToolDefinition } from '@src/tools/registry';
import { executePublicActionDefinition } from './execute-public-action';
import { executePublicDashcardActionDefinition } from './execute-public-dashcard-action';
import { getPublicCardDefinition } from './get-public-card';
import { getPublicCardParamRemappingDefinition } from './get-public-card-param-remapping';
import { getPublicCardParamValuesDefinition } from './get-public-card-param-values';
import { getPublicCardQueryDefinition } from './get-public-card-query';
import { getPublicCardQueryFormatDefinition } from './get-public-card-query-format';
import { getPublicDashboardDefinition } from './get-public-dashboard';
import { getPublicDashboardParamRemappingDefinition } from './get-public-dashboard-param-remapping';
import { getPublicDashboardParamValuesDefinition } from './get-public-dashboard-param-values';
import { getPublicDashboardParamsDefinition } from './get-public-dashboard-params';
import { getPublicDashboardQueryDefinition } from './get-public-dashboard-query';
import { getPublicDashboardQueryFormatDefinition } from './get-public-dashboard-query-format';
import { getPublicOembedDefinition } from './get-public-oembed';
import { runPublicCardPivotQueryDefinition } from './run-public-card-pivot-query';
import { runPublicDashboardPivotQueryDefinition } from './run-public-dashboard-pivot-query';
import { runPublicDashcardQueryDefinition } from './run-public-dashcard-query';
import { searchPublicCardParamValuesDefinition } from './search-public-card-param-values';
import { searchPublicDashboardParamValuesDefinition } from './search-public-dashboard-param-values';
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
  getPublicCardParamValuesDefinition,
  searchPublicCardParamValuesDefinition,
  getPublicCardParamRemappingDefinition,
  getPublicDashboardParamValuesDefinition,
  searchPublicDashboardParamValuesDefinition,
  getPublicDashboardParamRemappingDefinition,
  executePublicActionDefinition,
  executePublicDashcardActionDefinition,
  runPublicCardPivotQueryDefinition,
  runPublicDashboardPivotQueryDefinition,
  getPublicOembedDefinition,
  runPublicDashcardQueryDefinition,
];
