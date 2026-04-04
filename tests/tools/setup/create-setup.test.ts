import { CreateSetupInputSchema } from '@src/schemas/setup';
import { createSetupDefinition } from '@src/tools/setup/create-setup';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createSetup tool', () => {
  it('should perform initial setup and return formatted MCP response', async () => {
    const mockResponse = { id: 'setup-complete' };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const input = { token: 'abc123', user: { email: 'admin@example.com', password: 'secret' } };
    const result = await createSetupDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/setup', expect.objectContaining({ token: 'abc123' }));
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Setup already complete');
    await expect(createSetupDefinition.handler(mockClient, { token: 'abc', user: {} })).rejects.toThrow('Setup already complete');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(createSetupDefinition.handler(mockClient, { token: 'abc', user: {} })).rejects.toThrow('Bad Request');
  });
  it('should have correct tool definition metadata', () => {
    expect(createSetupDefinition.name).toBe('create_setup');
    expect(createSetupDefinition.description).toBe('Perform initial Metabase setup');
    expect(createSetupDefinition.inputSchema).toEqual(CreateSetupInputSchema);
  });
});
