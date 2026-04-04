import { UnsubscribePulseEmailInputSchema } from '@src/schemas/pulse';
import { unsubscribePulseEmailDefinition } from '@src/tools/pulse/unsubscribe-pulse-email';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('unsubscribePulseEmail tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await unsubscribePulseEmailDefinition.handler(mockClient, {
      hash: 'abc123',
      email: 'user@example.com',
      pulse_id: 1,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/pulse/unsubscribe', {
      hash: 'abc123',
      email: 'user@example.com',
      pulse_id: 1,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      unsubscribePulseEmailDefinition.handler(mockClient, {
        hash: 'abc',
        email: 'user@example.com',
        pulse_id: 999,
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      unsubscribePulseEmailDefinition.handler(mockClient, {
        hash: 'abc',
        email: 'user@example.com',
        pulse_id: 1,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(unsubscribePulseEmailDefinition.name).toBe('unsubscribe_pulse_email');
    expect(unsubscribePulseEmailDefinition.description).toBe(
      'Unsubscribe from pulse email notifications in Metabase',
    );
    expect(unsubscribePulseEmailDefinition.inputSchema).toEqual(UnsubscribePulseEmailInputSchema);
  });
});
