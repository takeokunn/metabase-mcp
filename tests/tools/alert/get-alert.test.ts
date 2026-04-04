import { GetAlertInputSchema } from '@src/schemas/alert';
import { getAlertDefinition } from '@src/tools/alert/get-alert';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getAlert tool', () => {
  it('should return formatted MCP response with alert data', async () => {
    const mockAlert = {
      id: 1,
      card: { id: 10, name: 'Revenue Alert' },
      alert_condition: 'rows',
      alert_first_only: true,
      channels: [],
    };

    const mockClient = createMockClientWithResponse('get', mockAlert);

    const result = await getAlertDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockAlert);
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should use the correct ID in the URL', async () => {
    const mockAlert = { id: 42, card: { id: 20 }, alert_condition: 'goal' };

    const mockClient = createMockClientWithResponse('get', mockAlert);

    const result = await getAlertDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockAlert);
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Alert not found');

    await expect(getAlertDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Alert not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getAlertDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getAlertDefinition.name).toBe('get_alert');
    expect(getAlertDefinition.description).toBe('Get details of a specific alert in Metabase');
    expect(getAlertDefinition.inputSchema).toEqual(GetAlertInputSchema);
  });
});
