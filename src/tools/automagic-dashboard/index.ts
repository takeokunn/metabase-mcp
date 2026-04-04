import type { ToolDefinition } from '@src/tools/registry';
import { getXrayDatabaseCandidatesDefinition } from './get-xray-database-candidates';
import { getXrayEntityDefinition } from './get-xray-entity';
import { getXrayTableCellDefinition } from './get-xray-table-cell';

export const automagicDashboardTools: ToolDefinition<unknown>[] = [
  getXrayEntityDefinition,
  getXrayTableCellDefinition,
  getXrayDatabaseCandidatesDefinition,
];
