import { z } from 'zod';

export const UserKeyValueParamsSchema = z.object({
  namespace: z.string().describe('Key-value namespace (e.g., "ui-settings")'),
  key: z.string().describe('Key within the namespace'),
});
export type UserKeyValueParams = z.infer<typeof UserKeyValueParamsSchema>;

export const PutUserKeyValueInputSchema = z.object({
  namespace: z.string().describe('Key-value namespace'),
  key: z.string().describe('Key within the namespace'),
  value: z.unknown().describe('Value to store (any JSON-serializable value)'),
});
export type PutUserKeyValueInput = z.infer<typeof PutUserKeyValueInputSchema>;

export const ListUserNamespaceParamsSchema = z.object({
  namespace: z.string().describe('Namespace to list all key-value pairs for'),
});
export type ListUserNamespaceParams = z.infer<typeof ListUserNamespaceParamsSchema>;
