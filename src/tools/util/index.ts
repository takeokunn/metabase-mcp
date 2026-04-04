import type { ToolDefinition } from '@src/tools/registry';
import { generateRandomTokenDefinition } from './generate-random-token';

export const utilTools: ToolDefinition<unknown>[] = [generateRandomTokenDefinition];
