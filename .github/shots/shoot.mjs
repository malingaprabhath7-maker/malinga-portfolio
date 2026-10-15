// Takes screenshots of my other projects for the portfolio. Run by .github/workflows/screenshots.yml
import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('shots-out', { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
async function shot(name, url, after) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await wait(2500);
    if (after) await after(page);
    await page.screenshot({ path: `shots-out/${name}.png` });
    console.log('ok', name);
  } catch (e) { console.log('FAIL', name, e.message); }
}

await shot('travel-home', 'http://127.0.0.1:8101/index.html');
await shot('travel-package', 'http://127.0.0.1:8101/package.html?id=1');
await shot('travel-gallery', 'http://127.0.0.1:8101/gallery.html');
await shot('stress-login', 'http://127.0.0.1:8102/index.html');
await shot('echomood-home', 'http://127.0.0.1:8103/index.html');
await shot('calculator', 'http://127.0.0.1:5000/', async (p) => {
  for (const k of ['1', '2', '5', '×', '8', '=']) {
    const btn = p.getByRole('button', { name: k, exact: true });
    if (await btn.count()) { await btn.first().click(); await wait(200); }
  }
});
await shot('translator', 'http://127.0.0.1:7860/', async (p) => {
  // the free translation service rate-limits CI machines, so show the tool ready to use
  await p.locator('textarea').first().fill('Good morning! How can I help you today?');
  await wait(500);
});
await shot('chatbot', 'http://127.0.0.1:8501/', async (p) => {
  await wait(4000);
  const input = p.locator('textarea, input[type="text"]').last();
  await input.fill('How can I track my order?');
  await input.press('Enter');
  await wait(5000);
});
// AgriAid needs an account
await shot('agriaid-home', 'http://127.0.0.1:5001/');
try {
  await page.goto('http://127.0.0.1:5001/register', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'shots-out/agriaid-register.png' });
  const f = { name: 'Sunil Perera', district: 'Matara', phone: '0771234567', username: 'demo_farmer', password: 'Demo12345' };
  for (const [k, v] of Object.entries(f)) { const el = page.locator(`[name="${k}"]`); if (await el.count()) { const tag = await el.evaluate((n) => n.tagName); if (tag === 'SELECT') await el.selectOption({ index: 1 }); else await el.fill(v); } }
  const lang = page.locator('[name="language"]'); if (await lang.count()) { const tag = await lang.evaluate((n) => n.tagName); if (tag === 'SELECT') await lang.selectOption({ index: 0 }); }
  await page.locator('form button, form [type="submit"]').first().click(); await wait(1500);
  await page.goto('http://127.0.0.1:5001/login', { waitUntil: 'networkidle' });
  await page.fill('[name="username"]', 'demo_farmer'); await page.fill('[name="password"]', 'Demo12345');
  await page.locator('form button, form [type="submit"]').first().click(); await wait(2000);
  await shot('agriaid-info', 'http://127.0.0.1:5001/info');
  await shot('agriaid-upload', 'http://127.0.0.1:5001/upload');
  await shot('agriaid-result', 'http://127.0.0.1:5001/result?crop_type=Rice&detected_class=Rice_Blast&accuracy=94.2%25');
  await shot('agriaid-chat', 'http://127.0.0.1:5001/chat');
} catch (e) { console.log('FAIL agriaid flow', e.message); }
await b.close();
