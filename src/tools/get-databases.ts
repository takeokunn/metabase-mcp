import type { MetabaseClient } from '../client.js';

export async function getDatabases(client: MetabaseClient) {
  const databases = await client.getDatabases();
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(databases, null, 2),
      },
    ],
  };
}
