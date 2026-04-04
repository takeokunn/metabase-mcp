import type { MetabaseClient } from '@src/client';
import { type GetPublicOembed, GetPublicOembedSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicOembedDefinition: ToolDefinition<GetPublicOembed> = {
  name: 'get_public_oembed',
  description: 'Get oEmbed metadata for a public Metabase resource',
  inputSchema: GetPublicOembedSchema,
  handler: async (client: MetabaseClient, input: GetPublicOembed) => {
    const result = await client.get('/api/public/oembed', {
      url: input.url,
      maxheight: input.maxheight,
      maxwidth: input.maxwidth,
    });
    return formatToolResponse(result);
  },
};
