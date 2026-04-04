import type { ToolDefinition } from '@src/tools/registry';
import { uploadCsvDefinition } from './upload-csv';

export const uploadTools: ToolDefinition<unknown>[] = [uploadCsvDefinition];
