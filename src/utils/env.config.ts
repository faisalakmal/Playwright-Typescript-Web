import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';

const environments = ['dev', 'staging', 'production'] as const;
export type TestEnvironment = (typeof environments)[number];

const selectedEnvironment = process.env.TEST_ENV ?? 'dev';
if (!environments.includes(selectedEnvironment as TestEnvironment)) {
  throw new Error('TEST_ENV must be dev, staging, or production.');
}
const name = selectedEnvironment as TestEnvironment;
const root = path.resolve(__dirname, '../..');
const selectedFile = path.join(root, `.env.${name}`);
// Legacy .env is only accepted for dev. Other environments never inherit it.
const envFile =
  name === 'dev' && !existsSync(selectedFile)
    ? path.join(root, '.env')
    : selectedFile;

const result = config({ path: envFile, quiet: true });
if (result.error && (result.error as NodeJS.ErrnoException).code !== 'ENOENT') {
  throw result.error;
}

const requiredVariables = [
  'BASE_URL',
  'SAUCE_USERNAME',
  'SAUCE_PASSWORD',
] as const;
const missing = requiredVariables.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  throw new Error(
    `Missing configuration for ${name}: ${missing.join(', ')}. Fill ${selectedFile} using .env.${name}.example, or set shell/CI variables.`,
  );
}

function required(key: (typeof requiredVariables)[number]): string {
  return process.env[key]!;
}

const baseURL = required('BASE_URL').trim();
const parsedURL = new URL(baseURL);
if (!['http:', 'https:'].includes(parsedURL.protocol)) {
  throw new Error('BASE_URL must use HTTP or HTTPS.');
}

export const env = Object.freeze({
  name,
  baseURL,
  username: required('SAUCE_USERNAME'),
  password: required('SAUCE_PASSWORD'),
});
