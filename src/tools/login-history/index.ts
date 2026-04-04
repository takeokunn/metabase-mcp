import type { ToolDefinition } from '@src/tools/registry';
import { getLoginHistoryDefinition } from './get-login-history';

export const loginHistoryTools: ToolDefinition<unknown>[] = [getLoginHistoryDefinition];
