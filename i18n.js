// Textes du site en anglais (langue par défaut) et en français.
// Pour changer un texte, modifie-le ici : le même mot-clé est utilisé partout dans index.html et app.js.

export const STR = {
  en: {
    title: "Doublon: the party game where the rarest answer wins",
    metaDesc: "Free party game for friends, on your phones. One theme, one timer: the rarer your answer, the more points you earn.",
    otherLang: "Français",
    otherLangLabel: "Passer le site en français",
    logout: "Sign out",

    loginTitle: "The rarest answer wins",
    loginLead: "Sign in with your Google account to create a room or join one.",
    loginBtn: "Sign in with Google",
    setupTitle: "Setup required",
    setupBody: "Add your Firebase configuration to <code>config.js</code>, then reload the page. The steps are in <code>README.md</code>.",

    tier5: "Common",
    tier4: "Uncommon",
    tier3: "Rare",
    tier2: "Epic",
    tier1: "Legendary",
    tier0: "Not recognized",
    raritiesLabel: "The five rarities",

    homeLead: "A theme appears and everyone types as many answers as they can. The rarer your answer, the more points it earns.",
    nameLabel: "Your first name",
    namePh: "Alex",
    createBtn: "Create a room",
    orJoin: "or join a room",
    codePh: "CODE",
    codeLabel: "Room code",
    joinBtn: "Join",
    rulesTitle: "How to play?",
    rule1: "One person creates a room, the others enter the 4-letter code.",
    rule2: "Each round, a theme appears: \"Name a fruit\".",
    rule3: "Type as many answers as you can before time runs out.",
    rule4: "Every answer has a rarity: common 100 points, uncommon 300, rare 600, epic 1000, legendary 2000.",
    rule5: "Your rarity and points show up live. An answer that isn't on the list is rejected.",

    roomCode: "Room code",
    shareCode: "Share this code: the others enter it on this page.",
    players: "Players",
    startBtn: "Start the game",
    lobbyWait: "Waiting for the host to start",
    leaveBtn: "Leave",

    round: "Round {n}/{total}",
    answerPh: "Your answer, then Enter",
    ok: "OK",
    vault: "Your vault",
    answerOne: "{n} answer",
    answerMany: "{n} answers",
    pts: "pts",
    emptyVault: "No answers yet. Type the first one!",
    playHint: "The rarer an answer, the more it earns. A wrong answer is rejected.",
    timeUp: "Time's up! Computing the results…",
    maxAnswers: "20 answers maximum.",
    wrong: "“{v}” is wrong.",
    already: "You already gave that one!",

    resTop: "Top 3 of the round",
    resBoard: "Leaderboard",
    nobody: "Nobody answered…",
    nextRound: "Next round",
    showPodium: "See the podium",
    resWait: "The host is starting the next round…",

    endTitle: "Game over!",
    replayBtn: "Play again",

    popupBlocked: "The browser blocked the window: allow it and try again.",
    unauthorizedDomain: "Domain not authorized: add it in Firebase → Authentication → Settings.",
    signInFailed: "Sign-in failed, please try again.",
    nameFirst: "Enter your first name first!",
    createFailed: "Couldn't create the room (Firebase rules?).",
    codeLen: "The code has 4 letters.",
    roomNotFound: "Room not found.",
    alreadyStarted: "The game has already started.",
    roomFull: "Room is full.",
    joinFailed: "Couldn't join the room.",
    roomGone: "The room no longer exists.",
    noTheme: "No theme has an answer list yet (see answers.js).",

    profile: "Profile",
    close: "Close",
    cancel: "Cancel",
    logoutConfirm: "Sign out of your account?",
    logoutYes: "Yes, sign out",
    pfLoading: "Loading…",
    pfError: "Couldn't load your profile.",
    pfRules: "Firebase is refusing access to profiles. Publish the new database.rules.json in Firebase (Realtime Database → Rules), then try again.",
    pfEmpty: "Play your first game and your stats will show up here.",
    pfGames: "Games",
    pfWins: "Wins",
    pfWinRate: "Win rate",
    pfPoints: "Total points",
    pfByRarity: "Your finds by rarity",
    pfNote: "Saved to your Google account.",
  },

  fr: {
    title: "Doublon : le jeu de soirée où la réponse la plus rare gagne",
    metaDesc: "Jeu de soirée gratuit entre amis, sur vos téléphones. Un thème, un chrono : plus votre réponse est rare, plus elle rapporte de points.",
    otherLang: "English",
    otherLangLabel: "Switch the site to English",
    logout: "Se déconnecter",

    loginTitle: "La réponse la plus rare gagne",
    loginLead: "Connecte-toi avec ton compte Google pour créer une salle ou en rejoindre une.",
    loginBtn: "Se connecter avec Google",
    setupTitle: "Configuration requise",
    setupBody: "Ajoute ta configuration Firebase dans <code>config.js</code>, puis recharge la page. Les étapes sont dans le <code>README.md</code>.",

    tier5: "Commun",
    tier4: "Peu courant",
    tier3: "Rare",
    tier2: "Épique",
    tier1: "Légendaire",
    tier0: "Non reconnue",
    raritiesLabel: "Les cinq raretés",

    homeLead: "Un thème apparaît, tout le monde tape un maximum de réponses. Plus ta réponse est rare, plus elle rapporte de points.",
    nameLabel: "Ton prénom",
    namePh: "Camille",
    createBtn: "Créer une salle",
    orJoin: "ou rejoindre une salle",
    codePh: "CODE",
    codeLabel: "Code de la salle",
    joinBtn: "Rejoindre",
    rulesTitle: "Comment jouer ?",
    rule1: "Une personne crée une salle, les autres entrent le code à 4 lettres.",
    rule2: "À chaque manche, un thème s'affiche : « Cite un fruit ».",
    rule3: "Tape un maximum de réponses avant la fin du temps.",
    rule4: "Chaque réponse a une rareté : commune 100 points, peu courante 300, rare 600, épique 1000, légendaire 2000.",
    rule5: "Ta rareté et tes points s'affichent en direct. Une réponse qui n'est pas dans la liste est refusée.",

    roomCode: "Code de la salle",
    shareCode: "Partage ce code : les autres le saisissent sur cette page.",
    players: "Joueurs",
    startBtn: "Lancer la partie",
    lobbyWait: "En attente du lancement par l'hôte",
    leaveBtn: "Quitter",

    round: "Manche {n}/{total}",
    answerPh: "Ta réponse, puis Entrée",
    ok: "OK",
    vault: "Ton coffre",
    answerOne: "{n} réponse",
    answerMany: "{n} réponses",
    pts: "pts",
    emptyVault: "Aucune réponse pour l'instant. Tape la première !",
    playHint: "Plus une réponse est rare, plus elle rapporte. Une réponse fausse est refusée.",
    timeUp: "Temps écoulé ! Calcul des résultats…",
    maxAnswers: "20 réponses maximum.",
    wrong: "« {v} » est faux.",
    already: "Tu l'as déjà donnée !",

    resTop: "Top 3 de la manche",
    resBoard: "Classement",
    nobody: "Personne n'a répondu…",
    nextRound: "Manche suivante",
    showPodium: "Voir le podium",
    resWait: "L'hôte lance la suite…",

    endTitle: "Fin de partie !",
    replayBtn: "Rejouer",

    popupBlocked: "Le navigateur a bloqué la fenêtre : autorise-la et réessaie.",
    unauthorizedDomain: "Domaine non autorisé : ajoute-le dans Firebase → Authentication → Paramètres.",
    signInFailed: "Connexion impossible, réessaie.",
    nameFirst: "Entre ton prénom d'abord !",
    createFailed: "Impossible de créer la salle (règles Firebase ?).",
    codeLen: "Le code a 4 lettres.",
    roomNotFound: "Salle introuvable.",
    alreadyStarted: "La partie a déjà commencé.",
    roomFull: "Salle pleine.",
    joinFailed: "Impossible de rejoindre la salle.",
    roomGone: "La salle n'existe plus.",
    noTheme: "Aucun thème n'a encore de liste de réponses (voir answers.js).",

    profile: "Profil",
    close: "Fermer",
    cancel: "Annuler",
    logoutConfirm: "Te déconnecter de ton compte ?",
    logoutYes: "Oui, me déconnecter",
    pfLoading: "Chargement…",
    pfError: "Impossible de charger ton profil.",
    pfRules: "Firebase refuse l'accès aux profils. Publie le nouveau database.rules.json dans Firebase (Realtime Database → Règles), puis réessaie.",
    pfEmpty: "Joue ta première partie et tes statistiques apparaîtront ici.",
    pfGames: "Parties",
    pfWins: "Victoires",
    pfWinRate: "Taux de victoire",
    pfPoints: "Points au total",
    pfByRarity: "Tes trouvailles par rareté",
    pfNote: "Sauvegardé sur ton compte Google.",
  },
};

const KEY = "lang";
// Anglais par défaut ; le choix du joueur est retenu sur son appareil
export let lang = (() => {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "fr" || v === "en") return v;
  } catch {}
  return "en";
})();

export function t(key, vars = {}) {
  const s = STR[lang][key] ?? STR.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function setLang(l) {
  lang = l === "fr" ? "fr" : "en";
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
}

// Applique la langue à tous les textes fixes de index.html
export function applyStatic() {
  document.documentElement.lang = lang;
  document.title = t("title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDesc"));
  for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll("[data-i18n-html]")) el.innerHTML = t(el.dataset.i18nHtml);
  for (const el of document.querySelectorAll("[data-i18n-ph]")) el.placeholder = t(el.dataset.i18nPh);
  for (const el of document.querySelectorAll("[data-i18n-aria]")) el.setAttribute("aria-label", t(el.dataset.i18nAria));
  const b = document.querySelector("#btn-lang");
  if (b) {
    b.classList.toggle("is-fr", lang === "fr");
    b.setAttribute("aria-checked", String(lang === "fr"));
    b.setAttribute("aria-label", t("otherLangLabel"));
  }
}
