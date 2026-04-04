import type { ToolDefinition } from '@src/tools/registry';
import { bulkMoveCardsDefinition } from './bulk-move-cards';
import { listCardsInDashboardsDefinition } from './list-cards-in-dashboards';

/**
 * All cards bulk operation tool definitions
 */
export const cardsBulkTools: ToolDefinition<unknown>[] = [
  bulkMoveCardsDefinition,
  listCardsInDashboardsDefinition,
];
