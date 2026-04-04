import { AddRecentActivityInputSchema } from '@src/schemas/activity';
import { addRecentActivityDefinition } from '@src/tools/activity/add-recent-activity';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('addRecentActivity tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { id: 1 });
    const result = await addRecentActivityDefinition.handler(mockClient, { model_type: 'card', model_id: 1 });
    expectMcpContent(result, { id: 1 });
    expect(mockClient.post).toHaveBeenCalledWith('/api/activity/recents', { model_type: 'card', model_id: 1 });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(addRecentActivityDefinition.handler(mockClient, { model_type: 'card', model_id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(addRecentActivityDefinition.handler(mockClient, { model_type: 'card', model_id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(addRecentActivityDefinition.name).toBe('add_recent_activity');
    expect(addRecentActivityDefinition.description).toBe('Add an item to recent activity in Metabase');
    expect(addRecentActivityDefinition.inputSchema).toEqual(AddRecentActivityInputSchema);
  });
});
