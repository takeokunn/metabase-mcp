import { CreatePulseInputSchema } from '@src/schemas/pulse';
import { createPulseDefinition } from '@src/tools/pulse/create-pulse';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createPulse tool', () => {
  it('should create a pulse and return formatted MCP response', async () => {
    const mockPulse = { id: 1, name: 'Weekly Report', cards: [], channels: [] };
    const input = {
      name: 'Weekly Report',
      cards: [{ id: 1 }],
      channels: [{ channel_type: 'email' }],
    };

    const mockClient = createMockClientWithResponse('post', mockPulse);

    const result = await createPulseDefinition.handler(mockClient, input);

    expectMcpContent(result, mockPulse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/pulse', {
      name: 'Weekly Report',
      cards: [{ id: 1 }],
      channels: [{ channel_type: 'email' }],
      collection_id: undefined,
      skip_if_empty: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass all optional fields when provided', async () => {
    const mockPulse = { id: 2, name: 'Report' };
    const input = {
      name: 'Report',
      cards: [],
      channels: [],
      collection_id: 5,
      skip_if_empty: true,
    };

    const mockClient = createMockClientWithResponse('post', mockPulse);

    await createPulseDefinition.handler(mockClient, input);

    expect(mockClient.post).toHaveBeenCalledWith('/api/pulse', {
      name: 'Report',
      cards: [],
      channels: [],
      collection_id: 5,
      skip_if_empty: true,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');

    await expect(
      createPulseDefinition.handler(mockClient, { name: 'Test', cards: [], channels: [] }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(
      createPulseDefinition.handler(mockClient, { name: 'Test', cards: [], channels: [] }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(createPulseDefinition.name).toBe('create_pulse');
    expect(createPulseDefinition.description).toBe('Create a new pulse in Metabase');
    expect(createPulseDefinition.inputSchema).toEqual(CreatePulseInputSchema);
  });
});
