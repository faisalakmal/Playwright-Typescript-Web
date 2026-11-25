import { rmSync } from 'node:fs';
import path from 'node:path';

export default function globalSetup(): void {
  // Allure appends results by default; each test run should report only its own results.
  rmSync(path.resolve(__dirname, '../../allure-results'), {
    recursive: true,
    force: true,
  });
}
