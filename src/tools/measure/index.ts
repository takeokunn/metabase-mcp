import type { ToolDefinition } from '@src/tools/registry';
import { createMeasureDefinition } from './create-measure';
import { getMeasureDefinition } from './get-measure';
import { getMeasureDimensionRemappingDefinition } from './get-measure-dimension-remapping';
import { getMeasureDimensionValuesDefinition } from './get-measure-dimension-values';
import { listMeasuresDefinition } from './list-measures';
import { searchMeasureDimensionValuesDefinition } from './search-measure-dimension-values';
import { updateMeasureDefinition } from './update-measure';

export const measureTools: ToolDefinition<unknown>[] = [
  listMeasuresDefinition,
  getMeasureDefinition,
  createMeasureDefinition,
  updateMeasureDefinition,
  getMeasureDimensionValuesDefinition,
  searchMeasureDimensionValuesDefinition,
  getMeasureDimensionRemappingDefinition,
];
