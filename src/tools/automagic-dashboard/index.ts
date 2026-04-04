import type { ToolDefinition } from '@src/tools/registry';
import { getXrayCardDefinition } from './get-xray-card';
import { getXrayDatabaseCandidatesDefinition } from './get-xray-database-candidates';
import { getXrayFieldDefinition } from './get-xray-field';
import { getXrayMetricDefinition } from './get-xray-metric';
import { getXraySegmentDefinition } from './get-xray-segment';
import { getXrayTableDefinition } from './get-xray-table';
import { getXrayTableCellDefinition } from './get-xray-table-cell';

export const automagicDashboardTools: ToolDefinition<unknown>[] = [
  getXrayTableDefinition,
  getXrayTableCellDefinition,
  getXrayDatabaseCandidatesDefinition,
  getXrayCardDefinition,
  getXraySegmentDefinition,
  getXrayFieldDefinition,
  getXrayMetricDefinition,
];
