import type { ToolDefinition } from '@src/tools/registry';
import { createSetupDefinition } from './create-setup';

export const setupTools: ToolDefinition<unknown>[] = [createSetupDefinition];
