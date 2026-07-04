import type { ToolDefinition } from '@src/tools/registry';
import { executePublicActionDefinition } from './execute-public-action';
import { executePublicDashcardActionDefinition } from './execute-public-dashcard-action';
import { exportPublicCardQueryDefinition } from './export-public-card-query';
import { exportPublicDashcardQueryDefinition } from './export-public-dashcard-query';
import { exportPublicDashcardQueryFormatDefinition } from './export-public-dashcard-query-format';
import { exportPublicDocumentCardDefinition } from './export-public-document-card';
import { getPublicActionDefinition } from './get-public-action';
import { getPublicCardDefinition } from './get-public-card';
import { getPublicCardParamRemappingDefinition } from './get-public-card-param-remapping';
import { getPublicCardParamValuesDefinition } from './get-public-card-param-values';
import { getPublicCardQueryDefinition } from './get-public-card-query';
import { getPublicCardQueryFormatDefinition } from './get-public-card-query-format';
import { getPublicCardTileDefinition } from './get-public-card-tile';
import { getPublicDashboardDefinition } from './get-public-dashboard';
import { getPublicDashboardParamRemappingDefinition } from './get-public-dashboard-param-remapping';
import { getPublicDashboardParamValuesDefinition } from './get-public-dashboard-param-values';
import { getPublicDashboardParamsDefinition } from './get-public-dashboard-params';
import { getPublicDashboardTileDefinition } from './get-public-dashboard-tile';
import { getPublicDashcardExecuteDefinition } from './get-public-dashcard-execute';
import { getPublicDocumentDefinition } from './get-public-document';
import { getPublicDocumentCardDefinition } from './get-public-document-card';
import { getPublicOembedDefinition } from './get-public-oembed';
import { runPublicCardPivotQueryDefinition } from './run-public-card-pivot-query';
import { runPublicDashboardPivotDashcardQueryDefinition } from './run-public-dashboard-pivot-dashcard-query';
import { getPublicDashcardQueryDefinition } from './run-public-dashcard-query-get';
import { searchPublicCardParamValuesDefinition } from './search-public-card-param-values';
import { searchPublicDashboardParamValuesDefinition } from './search-public-dashboard-param-values';
import { searchPublicDashboardParamsDefinition } from './search-public-dashboard-params';

export const publicTools: ToolDefinition<unknown>[] = [
  getPublicCardDefinition,
  getPublicCardQueryDefinition,
  getPublicCardQueryFormatDefinition,
  getPublicDashboardDefinition,
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
  getPublicDashcardExecuteDefinition,
  runPublicCardPivotQueryDefinition,
  getPublicOembedDefinition,
  getPublicActionDefinition,
  exportPublicCardQueryDefinition,
  getPublicDashcardQueryDefinition,
  exportPublicDashcardQueryDefinition,
  runPublicDashboardPivotDashcardQueryDefinition,
  getPublicCardTileDefinition,
  getPublicDashboardTileDefinition,
  getPublicDocumentDefinition,
  getPublicDocumentCardDefinition,
  exportPublicDocumentCardDefinition,
  exportPublicDashcardQueryFormatDefinition,
];
