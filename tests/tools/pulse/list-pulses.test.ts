import { ListPulsesInputSchema } from '@src/schemas/pulse';
import { listPulsesDefinition } from '@src/tools/pulse/list-pulses';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listPulses tool', () => {
  it('should return formatted MCP response with pulses', async () => {
    const mockPulses = [
      { id: 1, name: 'Weekly Report' },
      { id: 2, name: 'Daily Digest' },
    ];

    const mockClient = createMockClientWithResponse('get', mockPulses);

    const result = await listPulsesDefinition.handler(mockClient, {});

    expectMcpContent(result, mockPulses);
    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse', { archived: undefined });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass archived param when provided', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    await listPulsesDefinition.handler(mockClient, { archived: true });

    expect(mockClient.get).toHaveBeenCalledWith('/api/pulse', { archived: true });
  });

  it('should handle empty pulse list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listPulsesDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listPulsesDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listPulsesDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listPulsesDefinition.name).toBe('list_pulses');
    expect(listPulsesDefinition.description).toBe('List all pulses in Metabase');
    expect(listPulsesDefinition.inputSchema).toEqual(ListPulsesInputSchema);
  });
});
