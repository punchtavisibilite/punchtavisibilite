const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 2200 } });
  await p.goto('file://' + __dirname + '/visuels.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.body.style.background = 'transparent');
  await p.locator('#s1').screenshot({ path: 'story1_overlay_transparent.png', omitBackground: true });
  for (const [id, f] of [['s2','story2_sondage.png'],['s3','story3_atelier.png'],['lk','post_linkedin_la_discrete.png']])
    await p.locator('#'+id).screenshot({ path: f });
  // aperçu story 1 sur fond "photo"
  await p.evaluate(() => { const s=document.getElementById('s1'); s.style.background='linear-gradient(160deg,#b9a99a,#6d625a 60%,#3d3632)'; });
  await p.locator('#s1').screenshot({ path: 'story1_apercu.png' });
  await b.close();
})();
