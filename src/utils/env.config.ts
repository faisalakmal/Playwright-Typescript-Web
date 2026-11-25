import { config } from 'dotenv';
import path from 'node:path';

config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value)
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and fill it in.`,
    );
  return value;
}

function loadEnvironment() {
  const baseURL = required('BASE_URL');
  const parsed = new URL(baseURL);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('BASE_URL must use HTTP or HTTPS.');
  }
  return Object.freeze({
    baseURL,
    username: required('SAUCE_USERNAME'),
    password: required('SAUCE_PASSWORD'),
  });
}

export const env = loadEnvironment();
