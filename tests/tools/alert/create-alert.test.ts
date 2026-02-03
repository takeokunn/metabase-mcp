import { CreateAlertInputSchema } from '@src/schemas/alert';
import { createAlertDefinition } from '@src/tools/alert/create-alert';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createAlert tool', () => {
  const baseAlertInput = {
    card: { id: 10 },
    alert_condition: 'rows' as const,
    alert_first_only: true,
  };

  it('should return formatted MCP response with created alert', async () => {
    const mockCreatedAlert = {
      id: 1,
      card: { id: 10, name: 'Sales Report' },
      channels: [],
      alert_condition: 'rows',
      alert_first_only: true,
      alert_above_goal: null,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedAlert);

    const result = await createAlertDefinition.handler(mockClient, baseAlertInput);

    expectMcpContent(result, mockCreatedAlert);
    expect(mockClient.post).toHaveBeenCalledWith('/api/alert', {
      card: { id: 10 },
      alert_condition: 'rows',
      alert_first_only: true,
      alert_above_goal: undefined,
      channels: [],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should include channels when provided', async () => {
    const inputWithChannels = {
      ...baseAlertInput,
      channels: [
        {
          channel_type: 'email' as const,
          enabled: true,
          recipients: [{ id: 1, email: 'user@example.com' }],
          schedule_type: 'daily' as const,
          schedule_hour: 9,
        },
      ],
    };

    const mockCreatedAlert = {
      id: 2,
      card: { id: 10 },
      channels: inputWithChannels.channels,
      alert_condition: 'rows',
      alert_first_only: true,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedAlert);

    const result = await createAlertDefinition.handler(mockClient, inputWithChannels);

    expectMcpContent(result, mockCreatedAlert);
    expect(mockClient.post).toHaveBeenCalledWith('/api/alert', {
      card: { id: 10 },
      alert_condition: 'rows',
      alert_first_only: true,
      alert_above_goal: undefined,
      channels: inputWithChannels.channels,
    });
  });

  it('should include alert_above_goal for goal condition', async () => {
    const inputWithGoal = {
      card: { id: 15 },
      alert_condition: 'goal' as const,
      alert_first_only: false,
      alert_above_goal: true,
    };

    const mockCreatedAlert = {
      id: 3,
      card: { id: 15 },
      channels: [],
      alert_condition: 'goal',
      alert_first_only: false,
      alert_above_goal: true,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedAlert);

    const result = await createAlertDefinition.handler(mockClient, inputWithGoal);

    expectMcpContent(result, mockCreatedAlert);
    expect(mockClient.post).toHaveBeenCalledWith('/api/alert', {
      card: { id: 15 },
      alert_condition: 'goal',
      alert_first_only: false,
      alert_above_goal: true,
      channels: [],
    });
  });

  it('should include card attachments when provided', async () => {
    const inputWithAttachments = {
      card: { id: 20, include_csv: true, include_xls: true },
      alert_condition: 'rows' as const,
      alert_first_only: true,
    };

    const mockCreatedAlert = {
      id: 4,
      card: { id: 20, include_csv: true, include_xls: true },
      channels: [],
      alert_condition: 'rows',
      alert_first_only: true,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedAlert);

    const result = await createAlertDefinition.handler(mockClient, inputWithAttachments);

    expectMcpContent(result, mockCreatedAlert);
    expect(mockClient.post).toHaveBeenCalledWith('/api/alert', {
      card: { id: 20, include_csv: true, include_xls: true },
      alert_condition: 'rows',
      alert_first_only: true,
      alert_above_goal: undefined,
      channels: [],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create alert');

    await expect(createAlertDefinition.handler(mockClient, baseAlertInput)).rejects.toThrow(
      'Failed to create alert',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

    await expect(createAlertDefinition.handler(mockClient, baseAlertInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createAlertDefinition.name).toBe('create_alert');
    expect(createAlertDefinition.description).toBe(
      'Create a new alert for a card (saved question) in Metabase',
    );
    expect(createAlertDefinition.inputSchema).toEqual(CreateAlertInputSchema);
  });
});
