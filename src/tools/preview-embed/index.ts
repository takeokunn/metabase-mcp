import type { ToolDefinition } from '@src/tools/registry';
import { executePreviewEmbedDashcardActionDefinition } from './execute-preview-embed-dashcard-action';
import { exportPreviewEmbedDashcardQueryDefinition } from './export-preview-embed-dashcard-query';
import { getPreviewEmbedCardParamRemappingDefinition } from './get-preview-embed-card-param-remapping';
import { getPreviewEmbedCardParamValuesDefinition } from './get-preview-embed-card-param-values';
import { getPreviewEmbedCardTileDefinition } from './get-preview-embed-card-tile';
import { getPreviewEmbedDashboardParamRemappingDefinition } from './get-preview-embed-dashboard-param-remapping';
import { getPreviewEmbedDashboardParamValuesDefinition } from './get-preview-embed-dashboard-param-values';
import { getPreviewEmbedDashboardTileDefinition } from './get-preview-embed-dashboard-tile';
import { previewEmbedCardDefinition } from './preview-embed-card';
import { previewEmbedCardQueryDefinition } from './preview-embed-card-query';
import { previewEmbedDashboardDefinition } from './preview-embed-dashboard';
import { previewEmbedDashboardParamsDefinition } from './preview-embed-dashboard-params';
import { previewEmbedDashboardQueryDefinition } from './preview-embed-dashboard-query';
import { runPreviewEmbedCardPivotQueryDefinition } from './run-preview-embed-card-pivot-query';
import { runPreviewEmbedDashboardPivotDashcardQueryDefinition } from './run-preview-embed-dashboard-pivot-dashcard-query';
import { runPreviewEmbedDashboardPivotQueryDefinition } from './run-preview-embed-dashboard-pivot-query';
import { runPreviewEmbedDashcardQueryDefinition } from './run-preview-embed-dashcard-query';
import { searchPreviewEmbedDashboardParamValuesDefinition } from './search-preview-embed-dashboard-param-values';

export const previewEmbedTools: ToolDefinition<unknown>[] = [
  previewEmbedCardDefinition,
  previewEmbedCardQueryDefinition,
  previewEmbedDashboardDefinition,
  previewEmbedDashboardQueryDefinition,
  previewEmbedDashboardParamsDefinition,
  getPreviewEmbedCardParamValuesDefinition,
  getPreviewEmbedDashboardParamValuesDefinition,
  searchPreviewEmbedDashboardParamValuesDefinition,
  runPreviewEmbedCardPivotQueryDefinition,
  runPreviewEmbedDashboardPivotQueryDefinition,
  executePreviewEmbedDashcardActionDefinition,
  getPreviewEmbedCardParamRemappingDefinition,
  getPreviewEmbedDashboardParamRemappingDefinition,
  runPreviewEmbedDashcardQueryDefinition,
  exportPreviewEmbedDashcardQueryDefinition,
  runPreviewEmbedDashboardPivotDashcardQueryDefinition,
  getPreviewEmbedCardTileDefinition,
  getPreviewEmbedDashboardTileDefinition,
];
