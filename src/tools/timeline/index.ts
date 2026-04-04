import type { ToolDefinition } from '@src/tools/registry';
import { createTimelineDefinition } from './create-timeline';
import { deleteTimelineDefinition } from './delete-timeline';
import { getCollectionRootTimelinesDefinition } from './get-collection-root-timelines';
import { getCollectionTimelinesDefinition } from './get-collection-timelines';
import { getTimelineDefinition } from './get-timeline';
import { listTimelinesDefinition } from './list-timelines';
import { updateTimelineDefinition } from './update-timeline';

export const timelineTools: ToolDefinition<unknown>[] = [
  listTimelinesDefinition,
  getTimelineDefinition,
  createTimelineDefinition,
  updateTimelineDefinition,
  deleteTimelineDefinition,
  getCollectionRootTimelinesDefinition,
  getCollectionTimelinesDefinition,
];
