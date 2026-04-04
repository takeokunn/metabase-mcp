import type { ToolDefinition } from '@src/tools/registry';
import { translateEntityIdsDefinition } from './translate-entity-ids';

export const eidTranslationTools: ToolDefinition<unknown>[] = [translateEntityIdsDefinition];
