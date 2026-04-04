import type { ToolDefinition } from '@src/tools/registry';
import { createMeasureDefinition } from './create-measure';
import { getMeasureDefinition } from './get-measure';
import { listMeasuresDefinition } from './list-measures';
import { updateMeasureDefinition } from './update-measure';

export const measureTools: ToolDefinition<unknown>[] = [
  listMeasuresDefinition,
  getMeasureDefinition,
  createMeasureDefinition,
  updateMeasureDefinition,
];
