const { chromium, devices } = require('playwright');

(async () => {
  const device = devices['iPhone 14 Pro'];
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/01-landing.png', fullPage: true });

  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'smooth' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/02-live-deals.png', fullPage: true });

  await page.getByRole('button', { name: /Book for/ }).first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/03-booking-drawer.png', fullPage: true });
  await page.getByRole('button', { name: 'Close' }).click();

  await page.goto('http://127.0.0.1:3000/bookings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/04-bookings.png', fullPage: true });

  await page.goto('http://127.0.0.1:3000/profile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/05-profile.png', fullPage: true });

  await page.goto('http://127.0.0.1:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/06-login.png', fullPage: true });

  await page.fill('input[placeholder="passcode"]', 'salon-daypass');
  await page.getByRole('button', { name: 'Unlock salon' }).click();
  await page.waitForURL('**/salon');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/07-salon.png', fullPage: true });

  await page.goto('http://127.0.0.1:3000/login', { waitUntil: 'networkidle' });
  await page.fill('input[placeholder="Admin passcode"]', 'admin-daypass');
  await page.getByRole('button', { name: 'Unlock admin' }).click();
  await page.waitForURL('**/admin');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/08-admin.png', fullPage: true });

  await browser.close();
})();
