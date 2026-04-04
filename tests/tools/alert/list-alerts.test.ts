import { ListAlertsInputSchema } from '@src/schemas/alert';
import { listAlertsDefinition } from '@src/tools/alert/list-alerts';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listAlerts tool', () => {
  it('should return formatted MCP response with alerts', async () => {
    const mockAlerts = [
      { id: 1, card: { id: 10, name: 'Revenue Alert' }, alert_condition: 'rows' },
      { id: 2, card: { id: 20, name: 'Goal Alert' }, alert_condition: 'goal' },
    ];

    const mockClient = createMockClientWithResponse('get', mockAlerts);

    const result = await listAlertsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockAlerts);
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty alerts list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listAlertsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listAlertsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listAlertsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listAlertsDefinition.name).toBe('list_alerts');
    expect(listAlertsDefinition.description).toBe('List all alerts in Metabase');
    expect(listAlertsDefinition.inputSchema).toEqual(ListAlertsInputSchema);
  });
});
