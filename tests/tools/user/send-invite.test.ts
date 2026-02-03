import { SendInviteInputSchema } from '@src/schemas/user';
import { sendInviteDefinition } from '@src/tools/user/send-invite';
import { describe, expect, it } from 'vitest';

import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';

describe('sendInvite tool', () => {
  it('should return formatted MCP response on successful invite send', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = {
      id: 1,
    };

    const result = await sendInviteDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/user/1/send_invite');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'User not found');

    const input = {
      id: 999,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow('User not found');
  });

  it('should propagate email configuration errors', async () => {
    const mockClient = createMockClientWithError('post', 'Email is not configured', 400);

    const input = {
      id: 1,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow(
      'Email is not configured',
    );
  });

  it('should propagate permission errors', async () => {
    const mockClient = createMockClientWithError(
      'post',
      'You do not have permission to send invites',
      403,
    );

    const input = {
      id: 1,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow(
      'You do not have permission to send invites',
    );
  });

  it('should propagate deactivated user errors', async () => {
    const mockClient = createMockClientWithError(
      'post',
      'Cannot send invite to deactivated user',
      400,
    );

    const input = {
      id: 1,
    };

    await expect(sendInviteDefinition.handler(mockClient, input)).rejects.toThrow(
      'Cannot send invite to deactivated user',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(sendInviteDefinition.name).toBe('send_invite');
    expect(sendInviteDefinition.description).toBe('Send an invite email to a user in Metabase');
    expect(sendInviteDefinition.inputSchema).toEqual(SendInviteInputSchema);
  });
});
