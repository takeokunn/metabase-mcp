import type { ToolDefinition } from '@src/tools/registry';
import { createCardDefinition } from './create-card';
import { deleteCardDefinition } from './delete-card';
import { executeCardDefinition } from './execute-card';
import { getCardDefinition } from './get-card';
import { getCardMetadataDefinition } from './get-card-metadata';
import { listCardsDefinition } from './list-cards';
import { updateCardDefinition } from './update-card';

/**
 * All card-related tool definitions
 */
export const cardTools: ToolDefinition<unknown>[] = [
  listCardsDefinition,
  getCardDefinition,
  getCardMetadataDefinition,
  createCardDefinition,
  updateCardDefinition,
  deleteCardDefinition,
  executeCardDefinition,
];
