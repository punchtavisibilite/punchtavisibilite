const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 2200 } });
  await p.goto('file://' + __dirname + '/stories.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  for (const [id,f] of [['s1','story4_et_toi.png'],['s2','story5_ce_qui_te_bloque.png'],['s3','story6_fais_bouger.png']])
    await p.locator('#'+id).screenshot({ path: f });
  await b.close();
})();
