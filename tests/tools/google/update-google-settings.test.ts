import { UpdateGoogleSettingsInputSchema } from '@src/schemas/google';
import { updateGoogleSettingsDefinition } from '@src/tools/google/update-google-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateGoogleSettings tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = { 'google-auth-client-id': 'my-client-id.apps.googleusercontent.com' };
    const result = await updateGoogleSettingsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/google/settings', input);
  });

  it('should work with both fields', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = {
      'google-auth-client-id': 'my-client-id.apps.googleusercontent.com',
      'google-auth-auto-create-accounts-domain': 'example.com',
    };
    await updateGoogleSettingsDefinition.handler(mockClient, input);
    expect(mockClient.put).toHaveBeenCalledWith('/api/google/settings', input);
  });

  it('should work with empty input', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateGoogleSettingsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/google/settings', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateGoogleSettingsDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));
    await expect(updateGoogleSettingsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateGoogleSettingsDefinition.name).toBe('update_google_settings');
    expect(updateGoogleSettingsDefinition.description).toBe(
      'Update Google authentication settings in Metabase',
    );
    expect(updateGoogleSettingsDefinition.inputSchema).toEqual(UpdateGoogleSettingsInputSchema);
  });
});
