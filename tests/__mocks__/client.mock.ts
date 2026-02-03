import type { MetabaseClient } from '@src/client';
import { vi } from 'vitest';

export type MockMetabaseClient = {
  [K in keyof MetabaseClient]: ReturnType<typeof vi.fn>;
};

/**
 * Creates a mock MetabaseClient with all methods stubbed using vi.fn()
 */
export function createMockClient(overrides?: Partial<MockMetabaseClient>): MockMetabaseClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

/**
 * Creates a mock client with a pre-configured successful response for a specific method.
 *
 * @param method - The HTTP method to mock ('get', 'post', 'put', 'delete')
 * @param response - The response data to return
 * @returns A mock client with the specified method configured
 */
export function createMockClientWithResponse<T>(
  method: keyof MetabaseClient,
  response: T,
): MockMetabaseClient {
  return createMockClient({
    [method]: vi.fn().mockResolvedValue(response),
  } as Partial<MockMetabaseClient>);
}

/**
 * Creates a mock client with a pre-configured error response for a specific method.
 *
 * @param method - The HTTP method to mock ('get', 'post', 'put', 'delete')
 * @param error - The error to throw (can be Error or message string)
 * @param status - Optional HTTP status code to attach to the error
 * @returns A mock client with the specified method configured to reject
 */
export function createMockClientWithError(
  method: keyof MetabaseClient,
  error: Error | string,
  status?: number,
): MockMetabaseClient {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  if (status !== undefined) {
    (errorObj as Error & { status?: number }).status = status;
  }
  return createMockClient({
    [method]: vi.fn().mockRejectedValue(errorObj),
  } as Partial<MockMetabaseClient>);
}
