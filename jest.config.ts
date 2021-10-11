import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['node_modules', '__tests__/node/helpers', '__tests__/deno'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    }
  }
};
export default config;