import type { ToolDefinition } from '@src/tools/registry';
import { getBugReportingDetailsDefinition } from './get-bug-reporting-details';
import { getConnectionPoolDetailsDefinition } from './get-connection-pool-details';

export const bugReportingTools: ToolDefinition<unknown>[] = [
  getBugReportingDetailsDefinition,
  getConnectionPoolDetailsDefinition,
];
