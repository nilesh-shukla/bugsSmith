const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const url = 'http://localhost:5174/analyze';

  const browser = await chromium.launch({ headless: true });

  // Desktop context
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  // pre-auth: inject a fake user into localStorage so protected route renders
  await context.addInitScript(() => {
    try {
      localStorage.setItem('accessToken', 'fake-token-for-screenshots');
      localStorage.setItem('user', JSON.stringify({ firstName: 'Demo', lastName: 'User', email: 'demo@example.com', role: 'admin' }));
    } catch (e) {}
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, 'dashboard-desktop.png'), fullPage: true });

  const sections = ['Analyze', 'Visualise', 'Integerations'];
  for (const s of sections) {
    try {
      // click via DOM to avoid visibility/locator issues
      await page.evaluate((label) => {
        const el = Array.from(document.querySelectorAll('div')).find(n => n.textContent && n.textContent.trim() === label);
        if (el) el.click();
      }, s);
      await page.waitForTimeout(600);
      const file = `${s.toLowerCase()}-desktop.png`.replace(/ /g, '-');
      await page.screenshot({ path: path.join(outDir, file), fullPage: true });
    } catch (e) {
      console.error('Failed to capture section', s, e.message);
    }
  }

  // Mobile context
  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1' });
  const pageM = await mobile.newPage();
  await pageM.goto(url, { waitUntil: 'networkidle' });
  await pageM.waitForTimeout(800);
  await pageM.screenshot({ path: path.join(outDir, 'dashboard-mobile.png'), fullPage: true });

  for (const s of sections) {
    try {
      await pageM.evaluate((label) => {
        const el = Array.from(document.querySelectorAll('div')).find(n => n.textContent && n.textContent.trim() === label);
        if (el) el.click();
      }, s);
      await pageM.waitForTimeout(600);
      const file = `${s.toLowerCase()}-mobile.png`.replace(/ /g, '-');
      await pageM.screenshot({ path: path.join(outDir, file), fullPage: true });
    } catch (e) {
      console.error('Failed to capture mobile section', s, e.message);
    }
  }

  await browser.close();
  console.log('Screenshots saved to', outDir);
})();
