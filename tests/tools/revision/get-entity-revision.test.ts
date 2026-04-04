import { GetEntityRevisionInputSchema } from '@src/schemas/revision';
import { getEntityRevisionDefinition } from '@src/tools/revision/get-entity-revision';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEntityRevision tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1 });
    const result = await getEntityRevisionDefinition.handler(mockClient, { entity: 'card', id: 1 });
    expectMcpContent(result, { id: 1 });
    expect(mockClient.get).toHaveBeenCalledWith('/api/revision/card/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getEntityRevisionDefinition.handler(mockClient, { entity: 'card', id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getEntityRevisionDefinition.handler(mockClient, { entity: 'card', id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEntityRevisionDefinition.name).toBe('get_entity_revision');
    expect(getEntityRevisionDefinition.description).toBe('Get revision history for a specific entity by type and ID in Metabase');
    expect(getEntityRevisionDefinition.inputSchema).toEqual(GetEntityRevisionInputSchema);
  });
});
