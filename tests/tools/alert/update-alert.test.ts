import { UpdateAlertInputSchema } from '@src/schemas/alert';
import { updateAlertDefinition } from '@src/tools/alert/update-alert';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateAlert tool', () => {
  it('should return formatted MCP response with updated alert', async () => {
    const mockUpdatedAlert = {
      id: 1,
      card: { id: 10, name: 'Sales Report' },
      channels: [{ channel_type: 'email', enabled: true }],
      alert_condition: 'goal',
      alert_first_only: false,
      alert_above_goal: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedAlert);

    const result = await updateAlertDefinition.handler(mockClient, {
      id: 1,
      alert_condition: 'goal',
      alert_above_goal: true,
    });

    expectMcpContent(result, mockUpdatedAlert);
    expect(mockClient.put).toHaveBeenCalledWith('/api/alert/1', {
      alert_condition: 'goal',
      alert_above_goal: true,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update alert_first_only only', async () => {
    const mockUpdatedAlert = {
      id: 42,
      card: { id: 5 },
      channels: [],
      alert_condition: 'rows',
      alert_first_only: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedAlert);

    const result = await updateAlertDefinition.handler(mockClient, {
      id: 42,
      alert_first_only: false,
    });

    expectMcpContent(result, mockUpdatedAlert);
    expect(mockClient.put).toHaveBeenCalledWith('/api/alert/42', {
      alert_first_only: false,
    });
  });

  it('should update alert channels', async () => {
    const updatedChannels = [
      {
        channel_type: 'slack' as const,
        enabled: true,
        schedule_type: 'weekly' as const,
        schedule_day: 'mon' as const,
        schedule_hour: 10,
      },
    ];

    const mockUpdatedAlert = {
      id: 5,
      card: { id: 15 },
      channels: updatedChannels,
      alert_condition: 'rows',
      alert_first_only: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedAlert);

    const result = await updateAlertDefinition.handler(mockClient, {
      id: 5,
      channels: updatedChannels,
    });

    expectMcpContent(result, mockUpdatedAlert);
    expect(mockClient.put).toHaveBeenCalledWith('/api/alert/5', {
      channels: updatedChannels,
    });
  });

  it('should update card configuration', async () => {
    const mockUpdatedAlert = {
      id: 3,
      card: { id: 20, include_csv: true, include_xls: false },
      channels: [],
      alert_condition: 'rows',
      alert_first_only: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedAlert);

    const result = await updateAlertDefinition.handler(mockClient, {
      id: 3,
      card: { include_csv: true, include_xls: false },
    });

    expectMcpContent(result, mockUpdatedAlert);
    expect(mockClient.put).toHaveBeenCalledWith('/api/alert/3', {
      card: { include_csv: true, include_xls: false },
    });
  });

  it('should archive an alert', async () => {
    const mockUpdatedAlert = {
      id: 7,
      card: { id: 25 },
      channels: [],
      alert_condition: 'rows',
      alert_first_only: true,
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedAlert);

    const result = await updateAlertDefinition.handler(mockClient, {
      id: 7,
      archived: true,
    });

    expectMcpContent(result, mockUpdatedAlert);
    expect(mockClient.put).toHaveBeenCalledWith('/api/alert/7', {
      archived: true,
    });
  });

  it('should update multiple fields at once', async () => {
    const mockUpdatedAlert = {
      id: 10,
      card: { id: 30, include_csv: true },
      channels: [{ channel_type: 'email', enabled: true }],
      alert_condition: 'goal',
      alert_first_only: false,
      alert_above_goal: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedAlert);

    const result = await updateAlertDefinition.handler(mockClient, {
      id: 10,
      card: { include_csv: true },
      alert_condition: 'goal',
      alert_first_only: false,
      alert_above_goal: false,
      channels: [{ channel_type: 'email', enabled: true }],
    });

    expectMcpContent(result, mockUpdatedAlert);
    expect(mockClient.put).toHaveBeenCalledWith('/api/alert/10', {
      card: { include_csv: true },
      alert_condition: 'goal',
      alert_first_only: false,
      alert_above_goal: false,
      channels: [{ channel_type: 'email', enabled: true }],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Alert not found');

    await expect(
      updateAlertDefinition.handler(mockClient, { id: 999, alert_first_only: true }),
    ).rejects.toThrow('Alert not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/alert/999', { alert_first_only: true });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Bad Request', 400));

    await expect(
      updateAlertDefinition.handler(mockClient, { id: 1, alert_first_only: true }),
    ).rejects.toThrow('Bad Request');
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateAlertDefinition.handler(mockClient, { id: 1, alert_first_only: true }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateAlertDefinition.name).toBe('update_alert');
    expect(updateAlertDefinition.description).toBe('Update an existing alert in Metabase');
    expect(updateAlertDefinition.inputSchema).toEqual(UpdateAlertInputSchema);
  });
});
