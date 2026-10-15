# playwright-ui-framework

![Playwright Tests](https://github.com/YOUR_GITHUB_USERNAME/playwright-ui-framework/actions/workflows/playwright.yml/badge.svg)

UI tests for [Sauce Demo](https://www.saucedemo.com) with Playwright and TypeScript.

**Stack:** Playwright, TypeScript, axe-core, GitHub Actions

## What's in it

- Page objects in `src/pages`, passed into tests as fixtures (`src/fixtures/test.ts`)
- Login runs once in `auth.setup.ts` and the session is reused, so tests don't log in every time
- Login, inventory (sorting, cart), and checkout tests, including checking the order total and tax
- Accessibility scan with axe-core (only critical issues fail the build)
- `known-defects.spec.ts` covers the site's deliberately broken users (`problem_user`, `performance_glitch_user`)
  using `test.fail()`
- Runs on Chromium, Firefox, WebKit and a mobile viewport (smoke only on mobile)

## Running

```bash
npm install
npx playwright install

npm test                 # all browsers
npm run test:smoke       # @smoke tests
npm run test:chromium    # one browser
npm run test:headed      # see the browser
npm run report           # last HTML report
```

`.env.example` shows the variables you can override.
