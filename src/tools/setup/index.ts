import type { ToolDefinition } from '@src/tools/registry';
import { checkSetupTokenDefinition } from './check-setup-token';

export const setupTools: ToolDefinition<unknown>[] = [checkSetupTokenDefinition];
