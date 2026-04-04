import type { ToolDefinition } from '@src/tools/registry';
import { createCardDefinition } from './create-card';
import { deleteCardDefinition } from './delete-card';
import { executeCardDefinition } from './execute-card';
import { getCardDefinition } from './get-card';
import { getCardMetadataDefinition } from './get-card-metadata';
import { listCardsDefinition } from './list-cards';
import { updateCardDefinition } from './update-card';
// Public Links
import { createCardPublicLinkDefinition } from './create-card-public-link';
import { deleteCardPublicLinkDefinition } from './delete-card-public-link';
import { listEmbeddableCardsDefinition } from './list-embeddable-cards';
import { listPublicCardsDefinition } from './list-public-cards';
// Copy & Series
import { copyCardDefinition } from './copy-card';
import { getCardSeriesDefinition } from './get-card-series';
import { getCardRelatedDefinition } from './get-card-related';
// Param & Field Values
import { getCardParamValuesDefinition } from './get-card-param-values';
import { searchCardParamValuesDefinition } from './search-card-param-values';
import { getCardFieldValuesDefinition } from './get-card-field-values';
import { searchCardFieldValuesDefinition } from './search-card-field-values';
// Query Execution & Export
import { executeCardPivotDefinition } from './execute-card-pivot';
import { exportCardQueryDefinition } from './export-card-query';

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

  // Public Links
  createCardPublicLinkDefinition,
  deleteCardPublicLinkDefinition,
  listEmbeddableCardsDefinition,
  listPublicCardsDefinition,

  // Copy & Series
  copyCardDefinition,
  getCardSeriesDefinition,
  getCardRelatedDefinition,

  // Param & Field Values
  getCardParamValuesDefinition,
  searchCardParamValuesDefinition,
  getCardFieldValuesDefinition,
  searchCardFieldValuesDefinition,

  // Query Execution & Export
  executeCardPivotDefinition,
  exportCardQueryDefinition,
];
