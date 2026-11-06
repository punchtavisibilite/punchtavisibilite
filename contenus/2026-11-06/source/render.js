const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 2200 } });
  await p.goto('file://' + __dirname + '/stories.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  for (const [id,f] of [['s1','story1_journal_du_coach.png'],['s2','story2_ceo_day_cafe.png'],['s3','story3_ca_va_bouger.png']])
    await p.locator('#'+id).screenshot({ path: f });
  await b.close();
})();
