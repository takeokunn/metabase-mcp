import { clearEmailDefinition } from '@src/tools/email/clear-email';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('clearEmail tool', () => {
  it('should clear SMTP configuration and return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await clearEmailDefinition.handler(mockClient, {});

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/email');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');

    await expect(clearEmailDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(clearEmailDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(clearEmailDefinition.name).toBe('clear_email');
    expect(clearEmailDefinition.description).toBe(
      'Clear the SMTP email configuration in Metabase',
    );
    expect(clearEmailDefinition.inputSchema).toEqual({});
  });
});
