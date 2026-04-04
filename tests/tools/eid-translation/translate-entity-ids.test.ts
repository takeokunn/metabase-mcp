import { translateEntityIdsDefinition } from '@src/tools/eid-translation/translate-entity-ids';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('translateEntityIds tool', () => {
  const input = {
    entity_ids: [
      { model: 'card', id: 'abc123' },
      { model: 'dashboard', id: 'def456' },
    ],
  };

  it('should return formatted MCP response with translated IDs', async () => {
    const mockResult = {
      card: { abc123: { id: 42, name: 'My Card' } },
      dashboard: { def456: { id: 7, name: 'My Dashboard' } },
    };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await translateEntityIdsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint with entity_ids', async () => {
    const mockClient = createMockClientWithResponse('post', {});
    await translateEntityIdsDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/eid-translation/translate', {
      entity_ids: input.entity_ids,
    });
  });

  it('should handle empty entity_ids array', async () => {
    const emptyInput = { entity_ids: [] };
    const mockClient = createMockClientWithResponse('post', {});
    const result = await translateEntityIdsDefinition.handler(mockClient, emptyInput);
    expectMcpContent(result, {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(translateEntityIdsDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(translateEntityIdsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });
});
