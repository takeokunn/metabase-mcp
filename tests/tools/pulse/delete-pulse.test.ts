import { DeletePulseInputSchema } from '@src/schemas/pulse';
import { deletePulseDefinition } from '@src/tools/pulse/delete-pulse';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deletePulse tool', () => {
  it('should delete a pulse and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await deletePulseDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/pulse/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should use the correct ID in the URL', async () => {
    const mockClient = createMockClientWithResponse('delete', { success: true });

    await deletePulseDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/pulse/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Pulse not found');

    await expect(deletePulseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Pulse not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/pulse/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(deletePulseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deletePulseDefinition.name).toBe('delete_pulse');
    expect(deletePulseDefinition.description).toBe('Delete a pulse in Metabase');
    expect(deletePulseDefinition.inputSchema).toEqual(DeletePulseInputSchema);
  });
});
