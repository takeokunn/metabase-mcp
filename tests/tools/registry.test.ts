import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { MetabaseClient } from '@src/client';
import {
  type ToolDefinition,
  formatErrorResponse,
  formatToolResponse,
  registerTools,
} from '@src/tools/registry';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

describe('formatToolResponse', () => {
  it('should format data as MCP text content', () => {
    const data = { id: 1, name: 'Test' };

    const result = formatToolResponse(data);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(data);
  });

  it('should format array data correctly', () => {
    const data = [{ id: 1 }, { id: 2 }];

    const result = formatToolResponse(data);

    expect(result.content).toHaveLength(1);
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(data);
  });

  it('should format null data', () => {
    const result = formatToolResponse(null);

    expect(result.content).toHaveLength(1);
    expect(JSON.parse((result.content[0] as { text: string }).text)).toBeNull();
  });

  it('should format primitive values', () => {
    const result = formatToolResponse('test string');

    expect(result.content).toHaveLength(1);
    expect(JSON.parse((result.content[0] as { text: string }).text)).toBe('test string');
  });

  it('should format nested objects with pretty printing', () => {
    const data = { nested: { deep: { value: 42 } } };

    const result = formatToolResponse(data);

    const text = (result.content[0] as { text: string }).text;
    expect(text).toContain('\n');
    expect(JSON.parse(text)).toEqual(data);
  });
});

describe('formatErrorResponse', () => {
  it('should format error as MCP error response', () => {
    const error = new Error('Something went wrong');

    const result = formatErrorResponse(error);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect((result.content[0] as { text: string }).text).toBe('Error: Something went wrong');
    expect(result.isError).toBe(true);
  });

  it('should handle error with empty message', () => {
    const error = new Error('');

    const result = formatErrorResponse(error);

    expect((result.content[0] as { text: string }).text).toBe('Error: ');
    expect(result.isError).toBe(true);
  });

  it('should preserve error message with special characters', () => {
    const error = new Error('Failed: "test" with <special> chars & symbols');

    const result = formatErrorResponse(error);

    expect((result.content[0] as { text: string }).text).toBe(
      'Error: Failed: "test" with <special> chars & symbols',
    );
  });
});

describe('registerTools', () => {
  it('should register tools with the MCP server', () => {
    const mockServer = {
      tool: vi.fn(),
    } as unknown as McpServer;

    const mockClient = {} as MetabaseClient;

    const tools: ToolDefinition<{ id: number }>[] = [
      {
        name: 'test_tool',
        description: 'A test tool',
        inputSchema: z.object({ id: z.number() }),
        handler: vi.fn().mockResolvedValue(formatToolResponse({ success: true })),
      },
    ];

    registerTools(mockServer, mockClient, tools);

    expect(mockServer.tool).toHaveBeenCalledOnce();
    expect(mockServer.tool).toHaveBeenCalledWith(
      'test_tool',
      'A test tool',
      expect.any(Object),
      expect.any(Function),
    );
  });

  it('should register multiple tools', () => {
    const mockServer = {
      tool: vi.fn(),
    } as unknown as McpServer;

    const mockClient = {} as MetabaseClient;

    const tools: ToolDefinition<unknown>[] = [
      {
        name: 'tool_one',
        description: 'First tool',
        inputSchema: z.object({ a: z.string() }),
        handler: vi.fn(),
      },
      {
        name: 'tool_two',
        description: 'Second tool',
        inputSchema: z.object({ b: z.number() }),
        handler: vi.fn(),
      },
      {
        name: 'tool_three',
        description: 'Third tool',
        inputSchema: {},
        handler: vi.fn(),
      },
    ];

    registerTools(mockServer, mockClient, tools);

    expect(mockServer.tool).toHaveBeenCalledTimes(3);
  });

  it('should call handler with correct arguments on tool invocation', async () => {
    let capturedCallback: (args: { input?: unknown }) => Promise<unknown>;

    const mockServer = {
      tool: vi.fn().mockImplementation((_name, _desc, _schema, callback) => {
        capturedCallback = callback;
      }),
    } as unknown as McpServer;

    const mockClient = { get: vi.fn() } as unknown as MetabaseClient;

    const mockHandler = vi.fn().mockResolvedValue(formatToolResponse({ result: 'ok' }));

    const tools: ToolDefinition<{ id: number }>[] = [
      {
        name: 'test_tool',
        description: 'A test tool',
        inputSchema: z.object({ id: z.number() }),
        handler: mockHandler,
      },
    ];

    registerTools(mockServer, mockClient, tools);

    const result = await capturedCallback!({ input: { id: 42 } });

    expect(mockHandler).toHaveBeenCalledWith(mockClient, { id: 42 });
    expect(result).toEqual(formatToolResponse({ result: 'ok' }));
  });

  it('should handle empty input when tool has no parameters', async () => {
    let capturedCallback: (args: { input?: unknown }) => Promise<unknown>;

    const mockServer = {
      tool: vi.fn().mockImplementation((_name, _desc, _schema, callback) => {
        capturedCallback = callback;
      }),
    } as unknown as McpServer;

    const mockClient = {} as unknown as MetabaseClient;

    const mockHandler = vi.fn().mockResolvedValue(formatToolResponse({ data: [] }));

    const tools: ToolDefinition<Record<string, never>>[] = [
      {
        name: 'list_tool',
        description: 'A list tool',
        inputSchema: {},
        handler: mockHandler,
      },
    ];

    registerTools(mockServer, mockClient, tools);

    await capturedCallback!({});

    expect(mockHandler).toHaveBeenCalledWith(mockClient, {});
  });

  it('should catch and format errors from handlers', async () => {
    let capturedCallback: (args: { input?: unknown }) => Promise<unknown>;

    const mockServer = {
      tool: vi.fn().mockImplementation((_name, _desc, _schema, callback) => {
        capturedCallback = callback;
      }),
    } as unknown as McpServer;

    const mockClient = {} as unknown as MetabaseClient;

    const tools: ToolDefinition<{ id: number }>[] = [
      {
        name: 'failing_tool',
        description: 'A failing tool',
        inputSchema: z.object({ id: z.number() }),
        handler: vi.fn().mockRejectedValue(new Error('Handler failed')),
      },
    ];

    registerTools(mockServer, mockClient, tools);

    const result = await capturedCallback!({ input: { id: 1 } });

    expect(result).toEqual(formatErrorResponse(new Error('Handler failed')));
  });

  it('should convert non-Error thrown values to Error', async () => {
    let capturedCallback: (args: { input?: unknown }) => Promise<unknown>;

    const mockServer = {
      tool: vi.fn().mockImplementation((_name, _desc, _schema, callback) => {
        capturedCallback = callback;
      }),
    } as unknown as McpServer;

    const mockClient = {} as unknown as MetabaseClient;

    const tools: ToolDefinition<unknown>[] = [
      {
        name: 'string_error_tool',
        description: 'Throws string',
        inputSchema: {},
        handler: vi.fn().mockRejectedValue('string error'),
      },
    ];

    registerTools(mockServer, mockClient, tools);

    const result = (await capturedCallback!({})) as {
      content: { text: string }[];
      isError: boolean;
    };

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe('Error: string error');
  });
});

describe('isEmptySchema', () => {
  it('should register tool with empty schema for parameterless tools', () => {
    const mockServer = {
      tool: vi.fn(),
    } as unknown as McpServer;

    const mockClient = {} as MetabaseClient;

    const tools: ToolDefinition<Record<string, never>>[] = [
      {
        name: 'no_params_tool',
        description: 'Tool without parameters',
        inputSchema: {},
        handler: vi.fn(),
      },
    ];

    registerTools(mockServer, mockClient, tools);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'no_params_tool',
      'Tool without parameters',
      {},
      expect.any(Function),
    );
  });

  it('should register tool with input schema for tools with parameters', () => {
    const mockServer = {
      tool: vi.fn(),
    } as unknown as McpServer;

    const mockClient = {} as MetabaseClient;

    const inputSchema = z.object({ id: z.number() });

    const tools: ToolDefinition<{ id: number }>[] = [
      {
        name: 'with_params_tool',
        description: 'Tool with parameters',
        inputSchema,
        handler: vi.fn(),
      },
    ];

    registerTools(mockServer, mockClient, tools);

    expect(mockServer.tool).toHaveBeenCalledWith(
      'with_params_tool',
      'Tool with parameters',
      { input: inputSchema },
      expect.any(Function),
    );
  });
});
