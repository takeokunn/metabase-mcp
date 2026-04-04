import { ConfigureEmailInputSchema } from '@src/schemas/email';
import { configureEmailDefinition } from '@src/tools/email/configure-email';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('configureEmail tool', () => {
  it('should configure SMTP settings and return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = {
      host: 'smtp.example.com',
      port: '587',
      security: 'tls' as const,
      username: 'user@example.com',
      password: 'secret',
      from_address: 'noreply@example.com',
    };

    const result = await configureEmailDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/email', input);
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should configure with minimal required fields', async () => {
    const mockClient = createMockClientWithResponse('put', {});
    const input = { host: 'smtp.example.com' };

    await configureEmailDefinition.handler(mockClient, input);

    expect(mockClient.put).toHaveBeenCalledWith('/api/email', input);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');

    await expect(
      configureEmailDefinition.handler(mockClient, { host: 'smtp.example.com' }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      configureEmailDefinition.handler(mockClient, { host: 'smtp.example.com' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(configureEmailDefinition.name).toBe('configure_email');
    expect(configureEmailDefinition.inputSchema).toEqual(ConfigureEmailInputSchema);
  });
});
