import { vi } from 'vitest';

/**
 * Creates a mock fetch response with successful JSON data
 */
export function mockFetchResponse<T>(data: T, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

/**
 * Creates a mock fetch response with an error status
 */
export function mockFetchError(status: number, message: string) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
    text: () => Promise.resolve(message),
  });
}

/**
 * Creates a mock fetch that rejects with a network error
 */
export function mockNetworkError(error = 'Network error') {
  return vi.fn().mockRejectedValue(new Error(error));
}
