import type { ToolDefinition } from '@src/tools/registry';
import { getTaskDefinition } from './get-task';
import { getTaskInfoDefinition } from './get-task-info';
import { getTaskRunDefinition } from './get-task-run';
import { getTaskRunEntitiesDefinition } from './get-task-run-entities';
import { listTaskRunsDefinition } from './list-task-runs';
import { listTasksDefinition } from './list-tasks';
import { listUniqueTasksDefinition } from './list-unique-tasks';

export const taskTools: ToolDefinition<unknown>[] = [
  listTasksDefinition,
  getTaskDefinition,
  getTaskInfoDefinition,
  listTaskRunsDefinition,
  getTaskRunDefinition,
  listUniqueTasksDefinition,
  getTaskRunEntitiesDefinition,
];
