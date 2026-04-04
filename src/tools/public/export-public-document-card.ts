import type { MetabaseClient } from '@src/client';
import {
  type ExportPublicDocumentCard,
  ExportPublicDocumentCardSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportPublicDocumentCardDefinition: ToolDefinition<ExportPublicDocumentCard> = {
  name: 'export_public_document_card',
  description: 'Export a card from a publicly shared document in Metabase',
  inputSchema: ExportPublicDocumentCardSchema,
  handler: async (client: MetabaseClient, input: ExportPublicDocumentCard) => {
    const result = await client.post(
      `/api/public/document/${input.uuid}/card/${input.card_id}/${input.export_format}`,
      {},
    );
    return formatToolResponse(result);
  },
};
