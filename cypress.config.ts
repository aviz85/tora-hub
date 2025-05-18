import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalRunAllSpecs: true,
    supportFile: 'cypress/support/e2e.ts',
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
}); 