import type { ToolDefinition } from '@src/tools/registry';
import { createSegmentDefinition } from './create-segment';
import { deleteSegmentDefinition } from './delete-segment';
import { getSegmentDefinition } from './get-segment';
import { getSegmentRelatedDefinition } from './get-segment-related';
import { getSegmentRevisionsDefinition } from './get-segment-revisions';
import { listSegmentsDefinition } from './list-segments';
import { updateSegmentDefinition } from './update-segment';

/**
 * All segment-related tool definitions
 */
export const segmentTools: ToolDefinition<unknown>[] = [
  listSegmentsDefinition,
  getSegmentDefinition,
  createSegmentDefinition,
  updateSegmentDefinition,
  deleteSegmentDefinition,
  getSegmentRevisionsDefinition,
  getSegmentRelatedDefinition,
];
