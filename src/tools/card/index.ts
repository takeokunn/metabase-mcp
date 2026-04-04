import type { ToolDefinition } from '@src/tools/registry';
// Copy & Series
import { copyCardDefinition } from './copy-card';
import { createCardDefinition } from './create-card';
// Public Links
import { createCardPublicLinkDefinition } from './create-card-public-link';
import { deleteCardDefinition } from './delete-card';
import { deleteCardPublicLinkDefinition } from './delete-card-public-link';
import { executeCardDefinition } from './execute-card';
// Query Execution & Export
import { executeCardPivotDefinition } from './execute-card-pivot';
import { exportCardQueryDefinition } from './export-card-query';
import { getCardDefinition } from './get-card';
import { getCardDashboardsDefinition } from './get-card-dashboards';
import { getCardMetadataDefinition } from './get-card-metadata';
import { getCardParamRemappingDefinition } from './get-card-param-remapping';
// Param & Field Values
import { getCardParamValuesDefinition } from './get-card-param-values';
import { getCardSeriesDefinition } from './get-card-series';
import { listCardsDefinition } from './list-cards';
import { listEmbeddableCardsDefinition } from './list-embeddable-cards';
import { listPublicCardsDefinition } from './list-public-cards';
import { moveCardsToCollectionDefinition } from './move-cards-to-collection';
import { searchCardParamValuesDefinition } from './search-card-param-values';
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

  // Public Links
  createCardPublicLinkDefinition,
  deleteCardPublicLinkDefinition,
  listEmbeddableCardsDefinition,
  listPublicCardsDefinition,

  // Copy & Series
  copyCardDefinition,
  getCardSeriesDefinition,

  // Param & Field Values
  getCardParamValuesDefinition,
  searchCardParamValuesDefinition,
  getCardParamRemappingDefinition,
  getCardDashboardsDefinition,
  moveCardsToCollectionDefinition,

  // Query Execution & Export
  executeCardPivotDefinition,
  exportCardQueryDefinition,
];
