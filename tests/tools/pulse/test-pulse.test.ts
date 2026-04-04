import { TestPulseInputSchema } from '@src/schemas/pulse';
import { testPulseDefinition } from '@src/tools/pulse/test-pulse';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('testPulse tool', () => {
  it('should test a pulse and return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const pulseObj = { id: 1, name: 'Weekly Report', cards: [], channels: [] };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await testPulseDefinition.handler(mockClient, { pulse: pulseObj });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/pulse/test', pulseObj);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass the pulse object to the API', async () => {
    const pulseObj = { name: 'Test Pulse', channels: [{ channel_type: 'email' }] };

    const mockClient = createMockClientWithResponse('post', {});

    await testPulseDefinition.handler(mockClient, { pulse: pulseObj });

    expect(mockClient.post).toHaveBeenCalledWith('/api/pulse/test', pulseObj);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');

    await expect(testPulseDefinition.handler(mockClient, { pulse: {} })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(testPulseDefinition.handler(mockClient, { pulse: {} })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(testPulseDefinition.name).toBe('test_pulse');
    expect(testPulseDefinition.description).toBe(
      'Test a pulse by sending it immediately in Metabase',
    );
    expect(testPulseDefinition.inputSchema).toEqual(TestPulseInputSchema);
  });
});
