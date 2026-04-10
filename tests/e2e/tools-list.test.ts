import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { allTools, registerTools } from '@src/tools/index';
import { describe, expect, it } from 'vitest';
import { createMockClient } from '../__mocks__/client.mock';

describe('tools/list E2E', () => {
  it('should return all registered tools via MCP JSON-RPC protocol', async () => {
    const server = new McpServer({ name: 'metabase-mcp', version: '1.1.1' });
    const mockClient = createMockClient();

    registerTools(server, mockClient, allTools);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    const mcpClient = new Client({ name: 'test-client', version: '1.0.0' });

    await server.connect(serverTransport);
    await mcpClient.connect(clientTransport);

    const result = await mcpClient.listTools();

    expect(result.tools).toHaveLength(allTools.length);
  });

  it('should have no tool with an empty name or description', async () => {
    const server = new McpServer({ name: 'metabase-mcp', version: '1.1.1' });
    const mockClient = createMockClient();

    registerTools(server, mockClient, allTools);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    const mcpClient = new Client({ name: 'test-client', version: '1.0.0' });

    await server.connect(serverTransport);
    await mcpClient.connect(clientTransport);

    const result = await mcpClient.listTools();

    for (const tool of result.tools) {
      expect(tool.name, `Tool at index has empty name`).toBeTruthy();
      expect(tool.description, `Tool "${tool.name}" has empty description`).toBeTruthy();
    }
  });

  it('should have no tool with a null or undefined inputSchema', async () => {
    const server = new McpServer({ name: 'metabase-mcp', version: '1.1.1' });
    const mockClient = createMockClient();

    registerTools(server, mockClient, allTools);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    const mcpClient = new Client({ name: 'test-client', version: '1.0.0' });

    await server.connect(serverTransport);
    await mcpClient.connect(clientTransport);

    const result = await mcpClient.listTools();

    for (const tool of result.tools) {
      expect(
        tool.inputSchema,
        `Tool "${tool.name}" has null or undefined inputSchema`,
      ).not.toBeNull();
      expect(
        tool.inputSchema,
        `Tool "${tool.name}" has null or undefined inputSchema`,
      ).not.toBeUndefined();
    }
  });
});
