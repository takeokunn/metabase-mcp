import { expect } from 'vitest';

interface McpContent {
  type: string;
  text: string;
}

interface McpResult {
  content: McpContent[];
  isError?: boolean;
}

/**
 * Verifies that an MCP result is successful (has content array and no isError)
 */
export function expectMcpSuccess(result: McpResult): void {
  expect(result).toHaveProperty('content');
  expect(Array.isArray(result.content)).toBe(true);
  expect(result.content.length).toBeGreaterThan(0);
  expect(result.isError).not.toBe(true);
}

/**
 * Verifies that an MCP result is an error (has isError: true)
 */
export function expectMcpError(result: McpResult, message?: string): void {
  expect(result).toHaveProperty('content');
  expect(result).toHaveProperty('isError', true);

  if (message !== undefined) {
    expect(result.content[0].text).toContain(message);
  }
}

/**
 * Parses MCP result content and compares with expected data
 */
export function expectMcpContent<T>(result: McpResult, expectedData: T): void {
  expectMcpSuccess(result);
  expect(result.content[0].type).toBe('text');

  const parsedContent = JSON.parse(result.content[0].text);
  expect(parsedContent).toEqual(expectedData);
}
