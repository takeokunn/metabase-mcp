import { TestEmailInputSchema } from '@src/schemas/email';
import { testEmailDefinition } from '@src/tools/email/test-email';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('testEmail tool', () => {
  it('should send a test email and return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await testEmailDefinition.handler(mockClient, {
      to: 'admin@example.com',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/email/test', {
      to: 'admin@example.com',
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should send test email without recipient', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });

    await testEmailDefinition.handler(mockClient, {});

    expect(mockClient.post).toHaveBeenCalledWith('/api/email/test', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');

    await expect(testEmailDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(testEmailDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(testEmailDefinition.name).toBe('test_email');
    expect(testEmailDefinition.inputSchema).toEqual(TestEmailInputSchema);
  });
});
