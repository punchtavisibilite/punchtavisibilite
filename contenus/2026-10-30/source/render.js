const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 2200 } });
  await p.goto('file://' + __dirname + '/vendredi.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.locator('#s4').screenshot({ path: 'story4_sondage.png' });
  await p.locator('#s5').screenshot({ path: 'story5_preuve_jeanne.png' });
  await b.close();
})();
