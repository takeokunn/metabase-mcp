import { DismissDatabaseSpinnerInputSchema } from '@src/schemas/database';
import { dismissDatabaseSpinnerDefinition } from '@src/tools/database/dismiss-database-spinner';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('dismissDatabaseSpinner tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const result = await dismissDatabaseSpinnerDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/dismiss_spinner', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(dismissDatabaseSpinnerDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(dismissDatabaseSpinnerDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(dismissDatabaseSpinnerDefinition.name).toBe('dismiss_database_spinner');
    expect(dismissDatabaseSpinnerDefinition.description).toBe(
      'Dismiss the loading spinner for a database in Metabase',
    );
    expect(dismissDatabaseSpinnerDefinition.inputSchema).toEqual(DismissDatabaseSpinnerInputSchema);
  });
});
