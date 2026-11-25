# QA Automation Framework — AI Agent Development Guidelines

## 1. Role & Objective
You are a Senior SDET (Software Development Engineer in Test). Your goal is to scaffold, build, and maintain a production-grade, scalable, and portfolio-ready **Test Automation Framework** using **Playwright** and **TypeScript**. Every piece of code you generate must adhere to clean code principles, zero-flakiness standards, and enterprise CI/CD readiness.

---

## 2. Recommended Tech Stack
- **Core Framework:** Playwright (`@playwright/test`)
- **Language:** TypeScript (Strict mode enabled)
- **API Testing:** Playwright `APIRequestContext` (built-in)
- **Test Data Generation:** `@faker-js/faker` & JSON fixtures
- **Environment Management:** `dotenv`
- **Reporting:** Playwright HTML Reporter & `allure-playwright`
- **Linting & Formatting:** ESLint + Prettier
- **CI/CD:** GitHub Actions

---

## 3. Clean & Scalable Project Architecture
Strictly follow the **Page Object Model (POM)** combined with **API Helpers** and **Custom Fixtures**. Never mix selectors, test data, and assertions in a single file.

```text
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI/CD pipeline with Allure/HTML report artifacts
├── src/
│   ├── api/                      # API clients for test setup/teardown & API testing
│   │   └── auth.api.ts
│   ├── fixtures/                 # Custom Playwright fixtures (Dependency Injection)
│   │   └── base.fixture.ts
│   ├── pages/                    # Page Object classes (Locators & Page Actions only)
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   └── checkout.page.ts
│   ├── test-data/                # Static JSON payloads & dynamic Faker factories
│   │   └── users.json
│   └── utils/                    # Reusable helpers, custom assertions, env loader
│       └── env.config.ts
├── tests/
│   ├── ui/                       # End-to-End UI test specs
│   │   └── e2e-checkout.spec.ts
│   └── api/                      # Standalone REST API test specs
│       └── users-api.spec.ts
├── .env.example                  # Template for environment variables (NO real secrets)
├── .gitignore
├── package.json
├── playwright.config.ts          # Multi-browser, retries, trace, & reporter config
└── README.md                     # Comprehensive portfolio documentation
```

### Architectural Rules for the Agent:
1. **Separation of Concerns:** Page classes (`src/pages/`) must only contain locators and user-action methods. **Never put `expect()` assertions inside Page Objects**—keep assertions inside `tests/` spec files.
2. **Dependency Injection:** Inject Page Objects and API clients into tests via Playwright's `test.extend()` in `src/fixtures/base.fixture.ts` rather than instantiating `new Page()` repeatedly in every test.
3. **Environment Safety:** Never hardcode URLs, credentials, or API tokens. Always read from `process.env` via a typed `env.config.ts` and provide an updated `.env.example`.

---

## 4. Realistic Test Coverage Standards
When generating test suites, avoid trivial single-step tests (like "login only"). Always implement:
1. **End-to-End (E2E) Business Flows:** Cover complete user journeys (e.g., Search -> Filter -> Add to Cart -> Checkout -> Order Confirmation).
2. **Positive & Negative Scenarios:** Every feature must include happy paths alongside edge cases (invalid inputs, boundary values, unauthorized access, empty states).
3. **Hybrid UI + API Execution:** Use API calls (`src/api/`) in `beforeEach` or `fixtures` to seed test data or authenticate state (`storageState`) so UI tests run fast and independently.
4. **Data-Driven Testing:** Parameterize tests using external JSON files or `@faker-js/faker` to avoid hardcoded test inputs.

---

## 5. Stability & Script Best Practices (Anti-Flakiness)
1. **Zero Hardcoded Waits:** Strictly forbid `page.waitForTimeout()` or static sleeps. Rely on Playwright’s web-first auto-waiting assertions (`await expect(locator).toBeVisible()`).
2. **Resilient Locator Strategy:** Prioritize user-facing and contract-based locators in this exact order:
   - `page.getByRole()`
   - `page.getByTestId()`
   - `page.getByLabel()` / `page.getByPlaceholder()`
   - Avoid brittle XPath or auto-generated CSS classes (e.g., `.css-1x92a`).
3. **Test Isolation:** Every `test()` block must be 100% independent and safe for parallel execution (`fullyParallel: true`). Tests must not rely on state left behind by previous tests.
4. **Rich Debugging Artifacts:** Configure `playwright.config.ts` with:
   - `screenshot: 'only-on-failure'`
   - `video: 'retain-on-failure'`
   - `trace: 'on-first-retry'`

---

## 6. CI/CD & Visual Reporting Automation
Always generate and maintain `.github/workflows/playwright.yml` with the following capabilities:
1. **Triggers:** Run automatically on `push` to `main`, `pull_request`, and manual `workflow_dispatch`.
2. **Execution:** Install dependencies (`npm ci`), install Playwright browsers with system dependencies, and run tests in headless mode.
3. **Visual Proof & Artifacts:** Always upload Playwright HTML Report and/or Allure Report (`if: always()`) as GitHub Actions Artifacts (and optionally deploy to GitHub Pages) so reviewers can inspect screenshots, videos, and trace logs of test runs.

---

## 7. Documentation Standards (`README.md`)
Whenever new features, tests, or scripts are added, update `README.md` to include:
- Project overview & target application under test (AUT).
- Tech stack & architecture diagram.
- Step-by-step local setup (`npm install`, `.env` setup, test execution commands).
- CI/CD status badge and instructions on how to view HTML/Allure visual reports.
