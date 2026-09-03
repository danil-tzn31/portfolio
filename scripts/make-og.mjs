/**
 * Renders scripts/og-card.html to src/app/opengraph-image.png at 1200×630.
 *
 * Run once and commit the result — Next.js picks the file up by name and
 * writes the og:image tags itself. Playwright is not a dependency of the
 * site; this is a one-off authoring tool, run with npx.
 *
 *   npx playwright@1 install chromium
 *   node scripts/make-og.mjs
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.goto(`file://${path.join(root, 'og-card.html')}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(root, '..', 'src', 'app', 'opengraph-image.png') });

await browser.close();
console.log('wrote src/app/opengraph-image.png');
