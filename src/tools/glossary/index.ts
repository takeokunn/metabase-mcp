import type { ToolDefinition } from '@src/tools/registry';
import { createGlossaryEntryDefinition } from './create-glossary-entry';
import { deleteGlossaryEntryDefinition } from './delete-glossary-entry';
import { listGlossaryDefinition } from './list-glossary';
import { updateGlossaryEntryDefinition } from './update-glossary-entry';

export const glossaryTools: ToolDefinition<unknown>[] = [
  listGlossaryDefinition,
  createGlossaryEntryDefinition,
  updateGlossaryEntryDefinition,
  deleteGlossaryEntryDefinition,
];
