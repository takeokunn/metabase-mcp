import type { ToolDefinition } from '@src/tools/registry';
import { createTimelineEventDefinition } from './create-timeline-event';
import { deleteTimelineEventDefinition } from './delete-timeline-event';
import { getTimelineEventDefinition } from './get-timeline-event';
import { updateTimelineEventDefinition } from './update-timeline-event';

export const timelineEventTools: ToolDefinition<unknown>[] = [
  createTimelineEventDefinition,
  getTimelineEventDefinition,
  updateTimelineEventDefinition,
  deleteTimelineEventDefinition,
];
