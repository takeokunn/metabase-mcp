import { DeleteAlertInputSchema } from '@src/schemas/alert';
import { deleteAlertDefinition } from '@src/tools/alert/delete-alert';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteAlert tool', () => {
  it('should return formatted MCP response after deleting alert', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteAlertDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/alert/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete alert with different ID', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteAlertDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/alert/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Alert not found');

    await expect(deleteAlertDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Alert not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/alert/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(deleteAlertDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Forbidden');
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(deleteAlertDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteAlertDefinition.name).toBe('delete_alert');
    expect(deleteAlertDefinition.description).toBe('Delete an alert from Metabase');
    expect(deleteAlertDefinition.inputSchema).toEqual(DeleteAlertInputSchema);
  });
});
