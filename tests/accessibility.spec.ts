import { test, expect } from '@fixtures/test';
import AxeBuilder from '@axe-core/playwright';

const KNOWN_ISSUES = new Set<string>([
  'select-name', // sort dropdown has no label - raised
]);

const pages = [
  { name: 'inventory', path: '/inventory.html' },
  { name: 'cart', path: '/cart.html' },
];

for (const { name, path } of pages) {
  test(`${name} page has no critical accessibility violations @regression @a11y`, async ({ page }, testInfo) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();

    await testInfo.attach(`axe-${name}.json`, {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const critical = results.violations.filter((v) => v.impact === 'critical' && !KNOWN_ISSUES.has(v.id));
    expect(critical, critical.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });
}
