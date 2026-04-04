import { checkSetupTokenDefinition } from '@src/tools/setup/check-setup-token';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('checkSetupToken tool', () => {
  it('should return formatted MCP response with checklist', async () => {
    const mockResult = [
      { title: 'Add a database', completed: true },
      { title: 'Invite team members', completed: false },
    ];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await checkSetupTokenDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    await checkSetupTokenDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/setup/admin_checklist');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(checkSetupTokenDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(checkSetupTokenDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });
});
