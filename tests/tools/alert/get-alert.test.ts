import { GetAlertParamsSchema } from '@src/schemas/alert';
import { getAlertDefinition } from '@src/tools/alert/get-alert';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getAlert tool', () => {
  it('should return formatted MCP response with alert data', async () => {
    const mockAlert = {
      id: 1,
      card: { id: 10, name: 'Sales Report', include_csv: true, include_xls: false },
      channels: [
        {
          channel_type: 'email',
          enabled: true,
          recipients: [{ id: 1, email: 'user@example.com' }],
          schedule_type: 'daily',
          schedule_hour: 9,
        },
      ],
      alert_condition: 'rows',
      alert_first_only: true,
      alert_above_goal: null,
      creator: { id: 1, email: 'admin@example.com', common_name: 'Admin User' },
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      archived: false,
    };

    const mockClient = createMockClientWithResponse('get', mockAlert);

    const result = await getAlertDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockAlert);
    expect(mockClient.get).toHaveBeenCalledWith('/api/alert/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle alert with minimal data', async () => {
    const mockAlert = {
      id: 42,
      card: { id: 5 },
      channels: [],
      alert_condition: 'rows',
      alert_first_only: false,
    };

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
    expect(getAlertDefinition.description).toBe('Get a single alert by ID from Metabase');
    expect(getAlertDefinition.inputSchema).toEqual(GetAlertParamsSchema);
  });
});
