/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

feat/script-studio-ui-16096172312553521028
import tsconfigPaths from "vite-tsconfig-paths";

import tsconfigPaths from 'vite-tsconfig-paths';

import tsconfigPaths from 'vite-tsconfig-paths';
dev

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
