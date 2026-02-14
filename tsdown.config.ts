import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  fixedExtension: false,
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
