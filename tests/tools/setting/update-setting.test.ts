import { UpdateSettingInputSchema } from '@src/schemas/setting';
import { updateSettingDefinition } from '@src/tools/setting/update-setting';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateSetting tool', () => {
  it('should update a setting and return formatted MCP response', async () => {
    const mockResult = { key: 'site-name', value: 'New Name' };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateSettingDefinition.handler(mockClient, {
      key: 'site-name',
      value: 'New Name',
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/setting/site-name', { value: 'New Name' });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle non-string values', async () => {
    const mockClient = createMockClientWithResponse('put', {});

    await updateSettingDefinition.handler(mockClient, {
      key: 'enable-embedding',
      value: true,
    });

    expect(mockClient.put).toHaveBeenCalledWith('/api/setting/enable-embedding', { value: true });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');

    await expect(
      updateSettingDefinition.handler(mockClient, { key: 'site-name', value: 'x' }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateSettingDefinition.handler(mockClient, { key: 'site-name', value: 'x' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateSettingDefinition.name).toBe('update_setting');
    expect(updateSettingDefinition.inputSchema).toEqual(UpdateSettingInputSchema);
  });
});
