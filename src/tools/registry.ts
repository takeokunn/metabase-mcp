import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { MetabaseClient } from '@src/client';
import type { ZodRawShape, ZodType } from 'zod';

/**
 * Standard MCP tool response format
 */
export type ToolResponse = CallToolResult;

/**
 * Definition for a tool that can be registered with the MCP server
 */
export interface ToolDefinition<TInput = Record<string, never>> {
  name: string;
  description: string;
  inputSchema: ZodType<TInput> | Record<string, never>;
  handler: (client: MetabaseClient, input: TInput) => Promise<ToolResponse>;
}

/**
 * Format successful data as a tool response
 */
export function formatToolResponse(data: unknown): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Format an error as a tool response
 */
export function formatErrorResponse(error: Error): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: `Error: ${error.message}`,
      },
    ],
    isError: true,
  };
}

/**
 * Register multiple tools with the MCP server
 */
export function registerTools(
  server: McpServer,
  client: MetabaseClient,
  tools: ToolDefinition<unknown>[],
): void {
  for (const tool of tools) {
    const schema = isEmptySchema(tool.inputSchema)
      ? {}
      : { input: tool.inputSchema as ZodType<unknown> };

    server.tool(
      tool.name,
      tool.description,
      schema as ZodRawShape,
      async (args: { input?: unknown }) => {
        try {
          const input = args.input ?? {};
          return await tool.handler(client, input);
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          return formatErrorResponse(err);
        }
      },
    );
  }
}

/**
 * Check if schema is an empty object (for parameterless tools)
 */
function isEmptySchema(schema: unknown): schema is Record<string, never> {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    !('_def' in schema) &&
    Object.keys(schema).length === 0
  );
}
