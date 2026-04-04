import { setPersistRefreshScheduleDefinition } from '@src/tools/persist/set-persist-refresh-schedule';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('setPersistRefreshSchedule tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await setPersistRefreshScheduleDefinition.handler(mockClient, {
      schedule: '0 * * * *',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/persist/set-refresh-schedule', {
      schedule: '0 * * * *',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      setPersistRefreshScheduleDefinition.handler(mockClient, { schedule: '0 * * * *' }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(
      setPersistRefreshScheduleDefinition.handler(mockClient, { schedule: 'invalid' }),
    ).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(setPersistRefreshScheduleDefinition.name).toBe('set_persist_refresh_schedule');
  });
});
