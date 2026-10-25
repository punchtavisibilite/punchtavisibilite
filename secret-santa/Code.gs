// Secret Santa de Noël — Google Apps Script
// Les inscriptions sont rangées dans un Google Sheet créé automatiquement.
// Le tirage n'est enregistré nulle part : seuls les emails savent qui offre à qui.

const CODE_ORGA = 'NOEL2026';            // code secret de l'organisatrice : changez-le !
const BUDGET = '30 €';
const SUJET = '🎅 Ton Secret Santa de Noël';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Secret Santa de Noël')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function feuille_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  let ss = null;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('Secret Santa de Noël – inscriptions');
    ss.getSheets()[0].appendRow(['Date', 'Prénom', 'Email', 'Idée de cadeau']);
    props.setProperty('SHEET_ID', ss.getId());
  }
  return ss.getSheets()[0];
}

function participants_() {
  return feuille_().getDataRange().getValues().slice(1)
    .filter(function (r) { return r[2]; })
    .map(function (r) {
      return { prenom: String(r[1]), email: String(r[2]).trim().toLowerCase(), idee: String(r[3]) };
    });
}

function tirageLe_() {
  return PropertiesService.getScriptProperties().getProperty('TIRAGE_LE');
}

// Appelé par la page au chargement : uniquement les prénoms, jamais les emails ni les idées.
function etat() {
  return { prenoms: participants_().map(function (p) { return p.prenom; }), tirageLe: tirageLe_() };
}

function inscrire(prenom, email, idee) {
  prenom = String(prenom || '').trim().slice(0, 40);
  email = String(email || '').trim().toLowerCase().slice(0, 120);
  idee = String(idee || '').trim().slice(0, 300);
  if (!prenom || !idee) throw new Error('Il manque le prénom ou l\'idée de cadeau.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Cet email ne semble pas valide.');
  if (tirageLe_()) throw new Error('Le tirage a déjà eu lieu, les inscriptions sont fermées.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = feuille_();
    const emails = sh.getDataRange().getValues().map(function (r) { return String(r[2]).trim().toLowerCase(); });
    const ligne = emails.indexOf(email);
    const valeurs = [[new Date(), prenom, email, idee]];
    // Même email : on met à jour l'inscription au lieu d'en créer une deuxième.
    if (ligne > 0) sh.getRange(ligne + 1, 1, 1, 4).setValues(valeurs);
    else sh.appendRow(valeurs[0]);
  } finally {
    lock.releaseLock();
  }
  return etat();
}

function verifierCode_(code) {
  if (String(code || '').trim() !== CODE_ORGA) throw new Error('Code organisatrice incorrect.');
}

function espaceOrga(code) {
  verifierCode_(code);
  return { nb: participants_().length, tirageLe: tirageLe_() };
}

function lancerTirage(code) {
  verifierCode_(code);
  const liste = participants_();
  if (liste.length < 3) throw new Error('Il faut au moins 3 participants.');

  // On mélange, puis chacun offre à la personne suivante dans le cercle : personne ne tombe sur soi.
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = liste[i]; liste[i] = liste[j]; liste[j] = t;
  }
  liste.forEach(function (donneur, i) {
    const receveur = liste[(i + 1) % liste.length];
    GmailApp.sendEmail(donneur.email, SUJET, texte_(donneur, receveur), {
      htmlBody: html_(donneur, receveur),
      name: 'Secret Santa de Noël'
    });
  });

  // Les copies envoyées vont à la corbeille pour que l'organisatrice ne les voie pas.
  Utilities.sleep(3000);
  GmailApp.search('in:sent subject:"Ton Secret Santa de Noël" newer_than:1d').forEach(function (t) {
    t.moveToTrash();
  });

  const le = new Date().toISOString();
  PropertiesService.getScriptProperties().setProperty('TIRAGE_LE', le);
  return { nb: liste.length, tirageLe: le };
}

// Pour refaire un test : rouvre les inscriptions (la liste est gardée).
function rouvrir(code) {
  verifierCode_(code);
  PropertiesService.getScriptProperties().deleteProperty('TIRAGE_LE');
  return espaceOrga(code);
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function texte_(d, r) {
  return 'Coucou ' + d.prenom + ',\n\nLe tirage au sort a parlé ! Cette année, tu offres un cadeau à : ' + r.prenom +
    '\n\nSon idée de cadeau : ' + r.idee + '\nSon email : ' + r.email + '\nBudget : ' + BUDGET +
    ' maximum\n\nChut, c\'est un secret !\nJoyeux Noël';
}

function html_(d, r) {
  return '<div style="font-family:Arial,sans-serif;background:#0f2a1f;padding:24px">' +
    '<div style="max-width:480px;margin:0 auto;background:#fbf6ee;border-radius:16px;padding:28px;color:#2a1d18;border:3px dashed #b3202f">' +
    '<p style="font-size:28px;margin:0 0 8px;text-align:center">🎄🎅🎁</p>' +
    '<h1 style="color:#b3202f;text-align:center;margin:0 0 18px;font-size:24px">Ton Secret Santa de Noël</h1>' +
    '<p>Coucou ' + esc_(d.prenom) + ',</p>' +
    '<p>Le tirage au sort a parlé ! Cette année, tu offres un cadeau à :</p>' +
    '<p style="font-size:26px;font-weight:bold;text-align:center;color:#2f7a4f;margin:18px 0">' + esc_(r.prenom) + '</p>' +
    '<table style="width:100%;background:#fff;border-radius:10px;padding:12px;border:1px solid #eadfcf">' +
    '<tr><td style="padding:6px;color:#6b5a50">Son idée de cadeau</td><td style="padding:6px;font-weight:bold">' + esc_(r.idee) + '</td></tr>' +
    '<tr><td style="padding:6px;color:#6b5a50">Son email</td><td style="padding:6px">' + esc_(r.email) + '</td></tr>' +
    '<tr><td style="padding:6px;color:#6b5a50">Budget</td><td style="padding:6px;font-weight:bold">' + BUDGET + ' maximum</td></tr></table>' +
    '<p style="margin-top:18px">🤫 Chut, c\'est un secret : ne dis à personne sur qui tu es tombé(e) !</p>' +
    '<p>Joyeux Noël ✨</p></div></div>';
}
