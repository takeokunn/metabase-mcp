import { GetPulseInputSchema } from '@src/schemas/pulse';
import { getPulseDefinition } from '@src/tools/pulse/get-pulse';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPulse tool', () => {
  it('should return formatted MCP response with pulse data', async () => {
    const mockPulse = {
      id: 1,
      name: 'Weekly Report',
      cards: [],
      channels: [],
    };

    const mockClient = createMockClientWithResponse('get', mockPulse);

    const result = await getPulseDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockPulse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should use the correct ID in the URL', async () => {
    const mockPulse = { id: 42, name: 'Daily Digest' };

    const mockClient = createMockClientWithResponse('get', mockPulse);

    await getPulseDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Pulse not found');

    await expect(getPulseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Pulse not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getPulseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPulseDefinition.name).toBe('get_pulse');
    expect(getPulseDefinition.description).toBe('Get details of a specific pulse in Metabase');
    expect(getPulseDefinition.inputSchema).toEqual(GetPulseInputSchema);
  });
});
