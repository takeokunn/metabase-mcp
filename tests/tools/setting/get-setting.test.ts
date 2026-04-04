import { GetSettingParamsSchema } from '@src/schemas/setting';
import { getSettingDefinition } from '@src/tools/setting/get-setting';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSetting tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { key: 'site-name', value: 'My Company Metabase' };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getSettingDefinition.handler(mockClient, { key: 'site-name' });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/setting/site-name');
  });

  it('should use the key in the URL', async () => {
    const mockClient = createMockClientWithResponse('get', { key: 'site-locale', value: 'en' });

    await getSettingDefinition.handler(mockClient, { key: 'site-locale' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/setting/site-locale');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(getSettingDefinition.handler(mockClient, { key: 'x' })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not found', 404));

    await expect(getSettingDefinition.handler(mockClient, { key: 'x' })).rejects.toThrow(
      'Not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getSettingDefinition.name).toBe('get_setting');
    expect(getSettingDefinition.inputSchema).toEqual(GetSettingParamsSchema);
  });
});
