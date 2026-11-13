// Logique pure du jeu (sans DOM ni Firebase) : facile à tester.

// Les 5 raretés (1 = la plus rare). Les clés sont celles utilisées dans answers.js.
export const TIERS = {
  1: { key: "legendaire", label: "Légendaire", points: 2000 },
  2: { key: "epique", label: "Épique", points: 1000 },
  3: { key: "rare", label: "Rare", points: 600 },
  4: { key: "peu_courant", label: "Peu courant", points: 300 },
  5: { key: "commun", label: "Commun", points: 100 },
};
export const pts = (tier) => TIERS[tier]?.points ?? 0;
export const label = (tier) => TIERS[tier]?.label ?? "Non reconnue";

// Normalise une réponse : minuscules, sans accents, sans article, sans pluriel simple.
export function norm(s) {
  let t = String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\+/g, " plus ") // « C++ » et « C# » doivent rester différents de « C »
    .replace(/#/g, " sharp ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  t = t.replace(/^(le|la|les|l|un|une|des|du|de|d|the) /, "");
  return t
    .split(" ")
    .map((w) => (w.length > 3 ? w.replace(/(s|x)$/, "") : w))
    .join(" ");
}

export function lev(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return d[m][n];
}

// Regroupe les réponses inconnues quasi identiques (1 faute de frappe sur les mots assez longs).
export function cluster(keys) {
  const canon = {};
  const reps = [];
  for (const k of keys) {
    const r = reps.find((r) => r === k || (Math.min(r.length, k.length) >= 5 && lev(r, k) <= 1));
    if (r) canon[k] = r;
    else {
      reps.push(k);
      canon[k] = k;
    }
  }
  return canon;
}

/* ---------- Réponses acceptées et leur rareté ---------- */

// `answers` : { commun: [...], peu_courant: [...], rare: [...], epique: [...], legendaire: [...] }
// Chaque élément est un texte (même nom dans les deux langues), ou { fr, en } : chacun est un texte
// ou une liste de synonymes dont le premier est le nom affiché.
// Une entrée : { id (stocké dans la base, indépendant de la langue), names: { fr, en }, tier }
export function buildIndex(answers = {}) {
  const byKey = new Map(); // réponse normalisée (dans les deux langues) → entrée
  const byId = new Map(); // id → entrée
  const refuse = new Set((answers.refuse || []).map(norm).filter(Boolean)); // jamais acceptées
  const list = (x) => (Array.isArray(x) ? x : [x]).filter(Boolean);
  for (const [tier, def] of Object.entries(TIERS)) {
    for (const item of answers[def.key] || []) {
      const fr = list(typeof item === "object" && !Array.isArray(item) ? item.fr : item);
      const en = list(typeof item === "object" && !Array.isArray(item) ? item.en ?? item.fr : item);
      const all = [...fr, ...en];
      const keys = [...new Set(all.map(norm).filter(Boolean))];
      if (!keys.length || keys.every((k) => byKey.has(k))) continue; // déjà dans la liste : la première rareté gagne
      const entry = { id: fr[0], names: { fr: fr[0], en: en[0] ?? fr[0] }, tier: Number(tier) };
      byId.set(entry.id, entry);
      for (const k of keys) if (!byKey.has(k)) byKey.set(k, entry);
    }
  }
  return { byKey, byId, refuse };
}

// Retrouve l'entrée correspondant à ce que le joueur a tapé (ou null si inconnue).
// Tolère les accents, les pluriels, les articles et 1 faute de frappe sur les mots de 6 lettres ou plus.
export function matchAnswer(index, raw) {
  const k = norm(raw);
  if (!k || index.refuse?.has(k)) return null;
  const exact = index.byKey.get(k);
  if (exact) return exact;
  if (k.length < 6) return null;
  let best = null;
  let bestDist = 2;
  for (const [key, entry] of index.byKey) {
    if (key.length < 6) continue;
    const d = lev(k, key);
    if (d < bestDist) {
      best = entry;
      bestDist = d;
    }
  }
  return best;
}

// answers : { uid: ["réponse", ...] }
// Retourne la liste des réponses distinctes, de la plus rare à la moins rare, les inconnues en dernier.
// Chaque joueur touche les points complets de chaque réponse qu'il a trouvée.
export function computeResults(answers, index) {
  const found = new Map();
  const unknown = [];
  for (const [uid, list] of Object.entries(answers || {})) {
    for (const a of list || []) {
      const entry = matchAnswer(index, a);
      if (entry) {
        if (!found.has(entry)) found.set(entry, { answer: entry.id, tier: entry.tier, uids: [], points: pts(entry.tier) });
        const g = found.get(entry);
        if (!g.uids.includes(uid)) g.uids.push(uid);
      } else {
        const k = norm(a);
        if (k) unknown.push({ uid, a, k });
      }
    }
  }
  const out = [...found.values()];
  const canon = cluster([...new Set(unknown.map((x) => x.k))]);
  const groups = {};
  for (const x of unknown) {
    const g = (groups[canon[x.k]] ||= { answer: x.a, tier: 0, uids: [], points: 0 });
    if (!g.uids.includes(x.uid)) g.uids.push(x.uid);
  }
  out.push(...Object.values(groups));
  return out.sort((a, b) => b.points - a.points || a.answer.localeCompare(b.answer, "fr"));
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export function makeCode() {
  return Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
}
