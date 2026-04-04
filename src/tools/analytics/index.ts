import type { ToolDefinition } from '@src/tools/registry';
import { getAnalyticsStatsDefinition } from './get-analytics-stats';

/**
 * All analytics-related tool definitions
 */
export const analyticsTools: ToolDefinition<unknown>[] = [getAnalyticsStatsDefinition];
