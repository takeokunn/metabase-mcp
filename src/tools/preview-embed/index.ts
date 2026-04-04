import type { ToolDefinition } from '@src/tools/registry';
import { executePreviewEmbedDashcardActionDefinition } from './execute-preview-embed-dashcard-action';
import { exportPreviewEmbedCardQueryDefinition } from './export-preview-embed-card-query';
import { getPreviewEmbedCardParamValuesDefinition } from './get-preview-embed-card-param-values';
import { getPreviewEmbedDashboardParamValuesDefinition } from './get-preview-embed-dashboard-param-values';
import { previewEmbedCardDefinition } from './preview-embed-card';
import { previewEmbedCardQueryDefinition } from './preview-embed-card-query';
import { previewEmbedDashboardDefinition } from './preview-embed-dashboard';
import { previewEmbedDashboardParamsDefinition } from './preview-embed-dashboard-params';
import { previewEmbedDashboardQueryDefinition } from './preview-embed-dashboard-query';
import { runPreviewEmbedCardPivotQueryDefinition } from './run-preview-embed-card-pivot-query';
import { runPreviewEmbedDashboardPivotQueryDefinition } from './run-preview-embed-dashboard-pivot-query';
import { searchPreviewEmbedCardParamValuesDefinition } from './search-preview-embed-card-param-values';
import { searchPreviewEmbedDashboardParamValuesDefinition } from './search-preview-embed-dashboard-param-values';

export const previewEmbedTools: ToolDefinition<unknown>[] = [
  previewEmbedCardDefinition,
  previewEmbedCardQueryDefinition,
  previewEmbedDashboardDefinition,
  previewEmbedDashboardQueryDefinition,
  previewEmbedDashboardParamsDefinition,
  getPreviewEmbedCardParamValuesDefinition,
  searchPreviewEmbedCardParamValuesDefinition,
  exportPreviewEmbedCardQueryDefinition,
  getPreviewEmbedDashboardParamValuesDefinition,
  searchPreviewEmbedDashboardParamValuesDefinition,
  runPreviewEmbedCardPivotQueryDefinition,
  runPreviewEmbedDashboardPivotQueryDefinition,
  executePreviewEmbedDashcardActionDefinition,
];
