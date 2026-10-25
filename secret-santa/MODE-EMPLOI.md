# Secret Santa de Noël : mise en ligne (10 minutes)

La page tourne sur Google Apps Script, avec votre compte Google. C'est gratuit et vous obtenez un lien public à envoyer à tout le monde.

## 1. Créer le projet
1. Allez sur **https://script.google.com** (connectée à votre compte Gmail).
2. Cliquez sur **Nouveau projet**.
3. En haut à gauche, renommez-le : **Secret Santa de Noël**.

## 2. Coller le code
1. Dans le fichier **Code.gs** déjà ouvert, effacez tout et collez le contenu du fichier `Code.gs`.
2. **Changez le code secret** à la ligne `const CODE_ORGA = 'NOEL2026';` (gardez les apostrophes).
3. À gauche, cliquez sur le **+** à côté de « Fichiers », puis sur **HTML**. Nommez le fichier exactement **Index** (sans « .html »).
4. Effacez son contenu et collez le contenu du fichier `Index.html`.
5. Cliquez sur l'icône **disquette** pour enregistrer.

## 3. Mettre en ligne
1. En haut à droite : **Déployer** > **Nouveau déploiement**.
2. Cliquez sur la roue dentée, puis choisissez **Application Web**.
3. Réglez :
   - Exécuter en tant que : **Moi**
   - Qui peut accéder : **Tout le monde**
4. Cliquez sur **Déployer**, puis **Autoriser l'accès**. Choisissez votre compte.
   - Si Google affiche « Google n'a pas validé cette application » : cliquez sur **Paramètres avancés**, puis **Accéder à Secret Santa de Noël (non sécurisé)**. C'est normal, c'est votre propre script.
5. Copiez l'**URL de l'application Web** (elle se termine par `/exec`). **C'est le lien à envoyer à vos invités.**

## 4. Le jour J
1. Ouvrez le lien et cliquez sur **Espace organisatrice**, tout en bas.
2. Tapez votre code secret, puis cliquez sur **Lancer le tirage et envoyer les emails**.
3. Chacun reçoit son email. Les copies sont mises à la corbeille de votre Gmail, pour que vous ne voyiez rien.

## Bon à savoir
- Les inscriptions arrivent dans un Google Sheet créé automatiquement, nommé « Secret Santa de Noël – inscriptions », dans votre Drive. Vous pouvez y corriger ou supprimer une ligne.
- Sur la page, les invités ne voient que les prénoms des inscrits, pas les emails ni les idées.
- Une personne qui se réinscrit avec le même email met à jour son idée au lieu de créer un doublon.
- Après le tirage, les inscriptions se ferment. Le bouton « Rouvrir les inscriptions » sert à refaire un test.
- **Pour tester** : inscrivez 3 de vos propres adresses (par exemple vous+1@gmail.com, vous+2@gmail.com), lancez le tirage, puis rouvrez et supprimez les lignes de test dans le Google Sheet.
