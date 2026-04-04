import type { ToolDefinition } from '@src/tools/registry';
import { previewEmbedCardDefinition } from './preview-embed-card';
import { previewEmbedCardQueryDefinition } from './preview-embed-card-query';
import { previewEmbedDashboardDefinition } from './preview-embed-dashboard';
import { previewEmbedDashboardQueryDefinition } from './preview-embed-dashboard-query';
import { previewEmbedDashboardParamsDefinition } from './preview-embed-dashboard-params';

export const previewEmbedTools: ToolDefinition<unknown>[] = [
  previewEmbedCardDefinition,
  previewEmbedCardQueryDefinition,
  previewEmbedDashboardDefinition,
  previewEmbedDashboardQueryDefinition,
  previewEmbedDashboardParamsDefinition,
];
