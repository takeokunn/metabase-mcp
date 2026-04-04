import type { ToolDefinition } from '@src/tools/registry';
import { generateRandomTokenDefinition } from './generate-random-token';

/**
 * All util-related tool definitions
 */
export const utilTools: ToolDefinition<unknown>[] = [generateRandomTokenDefinition];
