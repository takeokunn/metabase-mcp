import { ListAlertsParamsSchema } from '@src/schemas/alert';
import { listAlertsDefinition } from '@src/tools/alert/list-alerts';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listAlerts tool', () => {
  it('should return formatted MCP response with alerts', async () => {
    const mockAlerts = [
      {
        id: 1,
        card: { id: 10, name: 'Sales Report' },
        channels: [{ channel_type: 'email', enabled: true }],
        alert_condition: 'rows',
        alert_first_only: true,
      },
      {
        id: 2,
        card: { id: 20, name: 'Revenue Dashboard' },
        channels: [{ channel_type: 'slack', enabled: true }],
        alert_condition: 'goal',
        alert_first_only: false,
        alert_above_goal: true,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockAlerts);

    const result = await listAlertsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockAlerts);
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should filter by card_id when provided', async () => {
    const mockAlerts = [
      {
        id: 3,
        card: { id: 15, name: 'Filtered Alert' },
        channels: [{ channel_type: 'email', enabled: true }],
        alert_condition: 'rows',
        alert_first_only: true,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockAlerts);

    const result = await listAlertsDefinition.handler(mockClient, { card_id: 15 });

    expectMcpContent(result, mockAlerts);
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert/question/15');
  });

  it('should handle empty alert list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listAlertsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
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
    expect(listAlertsDefinition.description).toBe(
      'Get list of alerts in Metabase, optionally filtered by card ID',
    );
    expect(listAlertsDefinition.inputSchema).toEqual(ListAlertsParamsSchema);
  });
});
