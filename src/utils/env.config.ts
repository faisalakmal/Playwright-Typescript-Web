import { config } from 'dotenv';
import path from 'node:path';

const envFile = path.resolve(__dirname, '../../.env');
// Keep file values separate so switching environments cannot inherit another section.
const fileValues: Record<string, string> = {};
const result = config({ path: envFile, processEnv: fileValues, quiet: true });
if (result.error && (result.error as NodeJS.ErrnoException).code !== 'ENOENT') {
  throw result.error;
}

const environments = ['dev', 'staging', 'production'] as const;
export type TestEnvironment = (typeof environments)[number];
const selectedEnvironment =
  process.env.TEST_ENV ?? fileValues.TEST_ENV ?? 'dev';
if (!environments.includes(selectedEnvironment as TestEnvironment)) {
  throw new Error('TEST_ENV must be dev, staging, or production.');
}
const name = selectedEnvironment as TestEnvironment;
const prefix = name.toUpperCase();

// Generic shell/CI values take priority, followed by prefixed shell values and .env.
function value(key: string): string | undefined {
  return (
    process.env[key] ??
    process.env[`${prefix}_${key}`] ??
    fileValues[`${prefix}_${key}`]
  );
}

const accountMode = value('ACCOUNT_MODE') ?? 'demo';
if (accountMode !== 'demo' && accountMode !== 'real') {
  throw new Error('ACCOUNT_MODE must be demo or real.');
}
if (accountMode === 'real' && name !== 'production') {
  throw new Error(
    'Real accounts are only supported in the production profile.',
  );
}

const requiredVariables = ['BASE_URL', 'SAUCE_PASSWORD'];
if (accountMode === 'real') requiredVariables.push('SAUCE_USERNAME');
const missing = requiredVariables.filter((key) => !value(key)?.trim());
if (missing.length > 0) {
  throw new Error(
    `Missing configuration for ${name}: ${missing.map((key) => `${prefix}_${key}`).join(', ')}. Fill ${envFile} using .env.example, or set shell/CI variables.`,
  );
}

const baseURL = value('BASE_URL')!.trim();
const parsedURL = new URL(baseURL);
if (!['http:', 'https:'].includes(parsedURL.protocol)) {
  throw new Error('BASE_URL must use HTTP or HTTPS.');
}

export const env = Object.freeze({
  name,
  baseURL,
  accountMode,
  productionUsername:
    accountMode === 'real' ? value('SAUCE_USERNAME') : undefined,
  password: value('SAUCE_PASSWORD')!,
});
