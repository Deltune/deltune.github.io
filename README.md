python -m http.server 8000

# Doublon — prototype

Jeu de soirée multijoueur, en anglais (par défaut) et en français (bouton en haut à droite, le choix est retenu sur l'appareil de chaque joueur) : un thème apparaît (« Cite un fruit »), chacun tape un maximum de réponses avant la fin du chrono. Chaque réponse a une rareté fixée à l'avance dans `answers.js` : commun = 100 points, peu courant = 300, rare = 600, épique = 1000, légendaire = 2000. Chaque réponse tapée s'affiche tout de suite avec sa rareté et ses points, et le total est visible en direct. Une réponse absente de la liste est refusée, et le joueur est prévenu tout de suite.

Site 100 % statique (HTML/CSS/JS) + Firebase Realtime Database pour synchroniser les salles.

## 1. Créer le projet Firebase (gratuit, ~5 min)

1. Va sur https://console.firebase.google.com → **Ajouter un projet** (Analytics inutile).
2. **Build → Authentication → Commencer → Sign-in method → Google → Activer** (nom public + e-mail d'assistance, puis Enregistrer).
3. **Build → Realtime Database → Créer une base de données** (choisis une région Europe, démarre en mode verrouillé).
4. Onglet **Règles** : colle le contenu de `database.rules.json` puis **Publier**.
5. **Paramètres du projet (roue dentée) → Tes applications → icône Web `</>`** : enregistre une app et copie l'objet `firebaseConfig`.
6. Colle ces valeurs dans `config.js` (n'oublie pas `databaseURL`, visible dans l'onglet Données de Realtime Database).

## 2. Tester en local

Les modules JS ne marchent pas en ouvrant le fichier directement : lance un petit serveur.

```
python3 -m http.server 8000
```

Puis ouvre http://localhost:8000 sur deux onglets (ou deux appareils sur le même réseau).

## 3. Héberger sur GitHub Pages

1. Crée un dépôt GitHub et envoie-y tous ces fichiers à la racine.
2. **Settings → Pages → Source : Deploy from a branch → `main` / `(root)`**.
3. Le site est en ligne sur `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/`.
4. Dans Firebase → Authentication → Paramètres → **Domaines autorisés**, ajoute `TON-PSEUDO.github.io`.

## Fichiers

- `index.html`, `style.css` : interface
- `app.js` : écrans, synchronisation Firebase, déroulé de la partie (l'hôte calcule les résultats)
- `logic.js` : reconnaissance des réponses (accents, pluriels, articles, synonymes, petite faute de frappe) et calcul des points
- `fonts/` : les polices du site (hébergées avec le site, rien n'est chargé depuis Google). À déposer aussi sur GitHub, avec le dossier.
- `i18n.js` : tous les textes du site, en anglais et en français (une ligne par texte, même mot-clé dans les deux langues)
- `prompts.js` : les thèmes, avec leur texte en anglais et en français
- `answers.js` : **les réponses acceptées pour chaque thème, rangées par rareté, en français et en anglais** (le format `c("Algérie", "Algeria")` est expliqué en haut du fichier). Un joueur peut taper la réponse dans l'une ou l'autre langue ; le nom affiché suit la langue de son site. Un thème sans liste n'est jamais proposé : tant que ce fichier est vide, la partie ne peut pas démarrer.
- `config.js` : ta configuration Firebase
- `database.rules.json` : règles de sécurité de la base (à republier dans Firebase à chaque modification : les statistiques du profil sont rangées dans `users/<ton identifiant>/stats`, lisibles et modifiables uniquement par leur propriétaire)

## Limites du prototype

- Les listes de réponses sont écrites à la main : une bonne réponse oubliée ne rapporte rien. Plus les listes sont complètes (et avec des synonymes), plus le jeu est juste.
- Les listes sont visibles dans le code du site : un joueur curieux peut les lire.
- Si l'hôte ferme la page pendant une manche, la partie est bloquée.
- Les règles de sécurité sont basiques : un joueur malin pourrait tricher en modifiant le code.
- Pas de nettoyage automatique des anciennes salles.
