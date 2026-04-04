import type { ToolDefinition } from '@src/tools/registry';
import { extractTablesFromSqlDefinition } from './extract-tables-from-sql';
import { generateSqlDefinition } from './generate-sql';
import { listLlmModelsDefinition } from './list-llm-models';

export const llmTools: ToolDefinition<unknown>[] = [
  generateSqlDefinition,
  extractTablesFromSqlDefinition,
  listLlmModelsDefinition,
];
