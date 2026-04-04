import type { ToolDefinition } from '@src/tools/registry';
import { createFieldDimensionDefinition } from './create-field-dimension';
import { deleteFieldDimensionDefinition } from './delete-field-dimension';
import { discardFieldValuesDefinition } from './discard-field-values';
import { getFieldDefinition } from './get-field';
import { getFieldRelatedDefinition } from './get-field-related';
import { getFieldValuesDefinition } from './get-field-values';
import { listFieldRemappingDefinition } from './list-field-remapping';
import { rescanFieldValuesDefinition } from './rescan-field-values';
import { searchFieldValuesDefinition } from './search-field-values';
import { updateFieldDefinition } from './update-field';
import { updateFieldRemappingDefinition } from './update-field-remapping';
import { updateFieldValuesDefinition } from './update-field-values';

/**
 * All field-related tool definitions
 */
export const fieldTools: ToolDefinition<unknown>[] = [
  getFieldDefinition,
  updateFieldDefinition,
  getFieldValuesDefinition,
  updateFieldValuesDefinition,
  rescanFieldValuesDefinition,
  discardFieldValuesDefinition,
  getFieldRelatedDefinition,
  searchFieldValuesDefinition,
  createFieldDimensionDefinition,
  deleteFieldDimensionDefinition,
  listFieldRemappingDefinition,
  updateFieldRemappingDefinition,
];
