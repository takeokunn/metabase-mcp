import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.js',
        'vitest.config.ts',
        'tsup.config.ts',
        'release.config.js',
        'src/index.ts',
        'src/types.ts',
        'src/version.ts',
        'src/schemas/**',
        'src/tools/index.ts',
        'src/tools/**/index.ts',
      ],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
      },
    },
  },
});
