import { GetXrayTableCellParamsSchema } from '@src/schemas/automagic-dashboard';
import { getXrayTableCellDefinition } from '@src/tools/automagic-dashboard/get-xray-table-cell';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayTableCell tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'automagic-dashboards/table/1/cell/foo/rule/prefix/rule', name: 'Cell X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayTableCellDefinition.handler(mockClient, {
      id: 1,
      row_value: 'foo',
      prefix: 'prefix',
      rule: 'rule',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/automagic-dashboards/table/1/cell/foo/rule/prefix/rule',
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getXrayTableCellDefinition.handler(mockClient, {
        id: 1,
        row_value: 'foo',
        prefix: 'prefix',
        rule: 'rule',
      }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getXrayTableCellDefinition.handler(mockClient, {
        id: 1,
        row_value: 'foo',
        prefix: 'prefix',
        rule: 'rule',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(getXrayTableCellDefinition.name).toBe('get_xray_table_cell');
    expect(getXrayTableCellDefinition.inputSchema).toEqual(GetXrayTableCellParamsSchema);
  });
});
