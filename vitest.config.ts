/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // Keep the content of global stylesheets so tests can read them with `?raw`.
    css: { include: [/src[\\/]styles[\\/].+\.css/] },
  },
});
