import { UpdatePulseInputSchema } from '@src/schemas/pulse';
import { updatePulseDefinition } from '@src/tools/pulse/update-pulse';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updatePulse tool', () => {
  it('should update a pulse and return formatted MCP response', async () => {
    const mockPulse = { id: 1, name: 'Updated Report' };
    const input = { id: 1, name: 'Updated Report' };

    const mockClient = createMockClientWithResponse('put', mockPulse);

    const result = await updatePulseDefinition.handler(mockClient, input);

    expectMcpContent(result, mockPulse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/pulse/1', {
      name: 'Updated Report',
      cards: undefined,
      channels: undefined,
      skip_if_empty: undefined,
      archived: undefined,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should pass all optional fields when provided', async () => {
    const mockPulse = { id: 2, name: 'Report', archived: true };
    const input = {
      id: 2,
      name: 'Report',
      cards: [{ id: 1 }],
      channels: [{ channel_type: 'slack' }],
      skip_if_empty: false,
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockPulse);

    await updatePulseDefinition.handler(mockClient, input);

    expect(mockClient.put).toHaveBeenCalledWith('/api/pulse/2', {
      name: 'Report',
      cards: [{ id: 1 }],
      channels: [{ channel_type: 'slack' }],
      skip_if_empty: false,
      archived: true,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Pulse not found');

    await expect(updatePulseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Pulse not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));

    await expect(updatePulseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updatePulseDefinition.name).toBe('update_pulse');
    expect(updatePulseDefinition.description).toBe('Update a pulse in Metabase');
    expect(updatePulseDefinition.inputSchema).toEqual(UpdatePulseInputSchema);
  });
});
