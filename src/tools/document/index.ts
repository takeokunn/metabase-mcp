import type { ToolDefinition } from '@src/tools/registry';
import { copyDocumentDefinition } from './copy-document';
import { createDocumentDefinition } from './create-document';
import { createDocumentPublicLinkDefinition } from './create-document-public-link';
import { deleteDocumentDefinition } from './delete-document';
import { deleteDocumentPublicLinkDefinition } from './delete-document-public-link';
import { exportDocumentCardQueryDefinition } from './export-document-card-query';
import { getDocumentDefinition } from './get-document';
import { listDocumentsDefinition } from './list-documents';
import { runDocumentCardQueryDefinition } from './run-document-card-query';
import { updateDocumentDefinition } from './update-document';

export const documentTools: ToolDefinition<unknown>[] = [
  listDocumentsDefinition,
  getDocumentDefinition,
  createDocumentDefinition,
  updateDocumentDefinition,
  deleteDocumentDefinition,
  copyDocumentDefinition,
  createDocumentPublicLinkDefinition,
  deleteDocumentPublicLinkDefinition,
  runDocumentCardQueryDefinition,
  exportDocumentCardQueryDefinition,
];
