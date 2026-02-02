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
