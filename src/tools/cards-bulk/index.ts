import type { ToolDefinition } from '@src/tools/registry';
import { bulkMoveCardsDefinition } from './bulk-move-cards';
import { listCardsInDashboardsDefinition } from './list-cards-in-dashboards';

export const cardsBulkTools: ToolDefinition<unknown>[] = [
  listCardsInDashboardsDefinition,
  bulkMoveCardsDefinition,
];
