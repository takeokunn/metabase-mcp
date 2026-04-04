import { UnsubscribePulseInputSchema } from '@src/schemas/pulse';
import { unsubscribePulseDefinition } from '@src/tools/pulse/unsubscribe-pulse';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('unsubscribePulse tool', () => {
  it('should unsubscribe from a pulse and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await unsubscribePulseDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/pulse/1/subscription');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should use the correct ID in the URL', async () => {
    const mockClient = createMockClientWithResponse('delete', { success: true });

    await unsubscribePulseDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/pulse/42/subscription');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Pulse not found');

    await expect(unsubscribePulseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Pulse not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/pulse/999/subscription');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(unsubscribePulseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(unsubscribePulseDefinition.name).toBe('unsubscribe_pulse');
    expect(unsubscribePulseDefinition.description).toBe('Unsubscribe from a pulse in Metabase');
    expect(unsubscribePulseDefinition.inputSchema).toEqual(UnsubscribePulseInputSchema);
  });
});
