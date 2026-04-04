import { sendSlackBugReportDefinition } from '@src/tools/slack/send-slack-bug-report';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('sendSlackBugReport tool', () => {
  it('should have EE annotation in description', () => {
    expect(sendSlackBugReportDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await sendSlackBugReportDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/slack/bug-report', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(sendSlackBugReportDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(sendSlackBugReportDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(sendSlackBugReportDefinition.name).toBe('send_slack_bug_report');
  });
});
