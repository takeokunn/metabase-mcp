import { UndoPulseUnsubscribeInputSchema } from '@src/schemas/pulse';
import { undoPulseUnsubscribeDefinition } from '@src/tools/pulse/undo-pulse-unsubscribe';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('undoPulseUnsubscribe tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await undoPulseUnsubscribeDefinition.handler(mockClient, {
      hash: 'abc123',
      email: 'user@example.com',
      pulse_id: 1,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/pulse/unsubscribe/undo', {
      hash: 'abc123',
      email: 'user@example.com',
      pulse_id: 1,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      undoPulseUnsubscribeDefinition.handler(mockClient, {
        hash: 'abc',
        email: 'user@example.com',
        pulse_id: 999,
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      undoPulseUnsubscribeDefinition.handler(mockClient, {
        hash: 'abc',
        email: 'user@example.com',
        pulse_id: 1,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(undoPulseUnsubscribeDefinition.name).toBe('undo_pulse_unsubscribe');
    expect(undoPulseUnsubscribeDefinition.description).toBe(
      'Undo an email unsubscribe from a pulse in Metabase',
    );
    expect(undoPulseUnsubscribeDefinition.inputSchema).toEqual(UndoPulseUnsubscribeInputSchema);
  });
});
