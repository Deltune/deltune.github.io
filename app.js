import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { firebaseConfig } from "./config.js";
import { PROMPTS } from "./prompts.js";
import { ANSWERS } from "./answers.js";
import { computeResults, buildIndex, matchAnswer, pts, makeCode } from "./logic.js";
import { t, lang, setLang, applyStatic } from "./i18n.js";

const ROUNDS = 5;
const DURATION = 30000; // round length (ms)
const MAX_PLAYERS = 20;

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const hue = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.codePointAt(0)) % 360; return h; };
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
// Pluie de confettis (décor, sans interaction)
function confetti(n = 46) {
  if (calm) return;
  const box = document.createElement("div");
  box.className = "confetti";
  const cols = ["#ffc83d", "#ff8fd0", "#8cc4ff", "#8ee6bb", "#fff4da"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % cols.length]};animation-delay:${Math.random() * 0.8}s;animation-duration:${2.2 + Math.random() * 1.6}s;--dx:${Math.round(Math.random() * 160 - 80)}px;--r:${Math.round(Math.random() * 720 - 360)}deg`;
    box.append(s);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 4500);
}

function show(id) {
  document.querySelectorAll("main > section").forEach((s) => (s.hidden = s.id !== id));
}
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

/* ---------- Langue (anglais par défaut, bouton pour passer en français) ---------- */
let statusKey = "playHint";
function setStatus(key) {
  statusKey = key;
  $("#play-status").textContent = t(key);
}
applyStatic();
$("#btn-lang").onclick = () => {
  setLang(lang === "en" ? "fr" : "en");
  applyStatic();
  if (room) {
    render();
    if (room.phase === "play") {
      drawChips();
      setStatus(statusKey);
    }
  }
  if ($("#profile").open) renderProfile();
};

if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  show("setup");
  throw new Error("Configuration Firebase manquante (config.js)");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let uid = null;
let offset = 0;
let code = null;
let room = null;
let unsub = null;
let myRound = -1;
let myAnswers = [];
let scheduled = -1;
let tick = null;
let revealedRound = -1;
let endShown = false;

// Les réponses acceptées d'un thème (answers.js), indexées une seule fois
const indexCache = new Map();
const indexFor = (id) => {
  if (!indexCache.has(id)) indexCache.set(id, buildIndex(ANSWERS[id]));
  return indexCache.get(id);
};
const playable = (p) => Object.values(ANSWERS[p.id] || {}).some((l) => l?.length);

// Le salon retient l'identifiant du thème et des réponses ; chaque joueur les voit dans sa langue
const promptOf = (id) => PROMPTS.find((p) => p.id === id);
const promptText = (id) => promptOf(id)?.text[lang] ?? id;
const packText = (id) => promptOf(id)?.pack[lang] ?? "";
const answerName = (promptId, answerId) => indexFor(promptId).byId.get(answerId)?.names[lang] ?? answerId;

const now = () => Date.now() + offset;
const roomRef = () => ref(db, `rooms/${code}`);
onValue(ref(db, ".info/serverTimeOffset"), (s) => (offset = s.val() || 0));

/* ---------- Compte Google ---------- */
$("#btn-google").onclick = () =>
  signInWithPopup(auth, new GoogleAuthProvider()).catch((e) => {
    console.error(e);
    if (e.code === "auth/popup-blocked") toast(t("popupBlocked"));
    else if (e.code === "auth/unauthorized-domain") toast(t("unauthorizedDomain"));
    else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") toast(t("signInFailed"));
  });
// Déconnexion : un bouton dans le profil, avec confirmation avant de partir
const askLogout = (on) => {
  $("#btn-logout").hidden = on;
  $("#logout-confirm").hidden = !on;
};
$("#btn-logout").onclick = () => askLogout(true);
$("#logout-cancel").onclick = () => askLogout(false);
$("#logout-yes").onclick = () => {
  $("#profile").close();
  signOut(auth);
};

const user = await new Promise((resolve) => {
  let first = true;
  onAuthStateChanged(auth, (u) => {
    if (u) {
      if (first) {
        first = false;
        resolve(u);
      }
    } else if (first) show("login");
    else location.reload(); // déconnexion
  });
});
uid = user.uid;
$("#btn-profile").hidden = false;
show("home");

/* ---------- Accueil ---------- */
$("#name").value = localStorage.getItem("name") || (user.displayName || "").split(" ")[0].slice(0, 16);

function getName() {
  const name = $("#name").value.trim().slice(0, 16);
  if (!name) {
    toast(t("nameFirst"));
    $("#name").focus();
    return null;
  }
  localStorage.setItem("name", name);
  return name;
}

$("#btn-create").onclick = async () => {
  const name = getName();
  if (!name) return;
  try {
    let c;
    for (let i = 0; i < 10; i++) {
      c = makeCode();
      if (!(await get(ref(db, `rooms/${c}/host`))).exists()) break;
    }
    await set(ref(db, `rooms/${c}`), {
      host: uid,
      phase: "lobby",
      round: 0,
      used: "",
      createdAt: Date.now(),
      players: { [uid]: { name, score: 0 } },
    });
    enter(c);
  } catch (e) {
    console.error(e);
    toast(t("createFailed"));
  }
};

$("#join-form").onsubmit = async (e) => {
  e.preventDefault();
  const name = getName();
  if (!name) return;
  const c = $("#code").value.trim().toUpperCase();
  if (c.length !== 4) return toast(t("codeLen"));
  try {
    const snap = await get(ref(db, `rooms/${c}`));
    if (!snap.exists()) return toast(t("roomNotFound"));
    const r = snap.val();
    const players = r.players || {};
    if (players[uid]) {
      await update(ref(db, `rooms/${c}/players/${uid}`), { name });
    } else {
      if (r.phase !== "lobby") return toast(t("alreadyStarted"));
      if (Object.keys(players).length >= MAX_PLAYERS) return toast(t("roomFull"));
      await set(ref(db, `rooms/${c}/players/${uid}`), { name, score: 0 });
    }
    enter(c);
  } catch (err) {
    console.error(err);
    toast(t("joinFailed"));
  }
};

document.querySelectorAll("[data-leave]").forEach((b) => (b.onclick = () => leave()));

function enter(c) {
  code = c;
  sessionStorage.setItem("code", c);
  scheduled = -1;
  myRound = -1;
  unsub?.();
  unsub = onValue(roomRef(), (s) => {
    room = s.val();
    if (!room) return leave(t("roomGone"));
    render();
  });
}

function leave(msg) {
  unsub?.();
  unsub = null;
  clearInterval(tick);
  code = null;
  room = null;
  sessionStorage.removeItem("code");
  show("home");
  if (msg) toast(msg);
}

// Reprise automatique après un rechargement de page
const saved = sessionStorage.getItem("code");
if (saved) {
  get(ref(db, `rooms/${saved}/players/${uid}`)).then((s) => (s.exists() ? enter(saved) : sessionStorage.removeItem("code")));
}

/* ---------- Affichage ---------- */
function playersList() {
  return Object.entries(room.players || {}).map(([id, p]) => ({ id, name: p.name, score: p.score || 0 }));
}
const nameOf = (id) => room.players?.[id]?.name ?? "?";

function render() {
  const isHost = room.host === uid;
  if (room.phase !== "play") clearInterval(tick);
  if (room.phase !== "end") endShown = false;
  if (room.phase === "lobby") {
    scheduled = -1;
    renderLobby(isHost);
  } else if (room.phase === "play") renderPlay(isHost);
  else if (room.phase === "results") renderResults(isHost);
  else if (room.phase === "end") renderEnd(isHost);
}

function renderLobby(isHost) {
  show("lobby");
  const ps = playersList();
  $("#room-code").textContent = code;
  $("#player-count").textContent = `(${ps.length}/${MAX_PLAYERS})`;
  $("#players").innerHTML = ps
    .map((p) => `<li class="${p.id === uid ? "me" : ""}"><span class="av" style="--h:${hue(p.name)}">${esc([...p.name][0]?.toUpperCase() || "?")}</span>${p.id === room.host ? "👑 " : ""}${esc(p.name)}</li>`)
    .join("");
  $("#btn-start").hidden = !isHost;
  $("#lobby-wait").hidden = isHost;
}

function renderPlay(isHost) {
  show("play");
  if (room.round !== myRound) {
    myRound = room.round;
    myAnswers = [];
    drawChips();
    $("#answer-input").value = "";
    setStatus("playHint");
  }
  $("#round-label").textContent = t("round", { n: room.round, total: ROUNDS });
  $("#pack-label").textContent = packText(room.prompt);
  $("#prompt").textContent = promptText(room.prompt);
  clearInterval(tick);
  tick = setInterval(updateTimer, 250);
  updateTimer();
  if (!$("#answer-input").disabled) $("#answer-input").focus({ preventScroll: true });

  // L'hôte clôt la manche un peu après la fin du temps (laisse le temps aux dernières réponses d'arriver)
  if (isHost && scheduled !== room.round) {
    scheduled = room.round;
    const round = room.round;
    setTimeout(() => finishRound(round), Math.max(0, room.endsAt - now()) + 1500);
  }
}

function updateTimer() {
  if (!room || room.phase !== "play") return;
  const left = Math.max(0, room.endsAt - now());
  $("#timer").textContent = Math.ceil(left / 1000);
  $("#timebar").style.width = `${Math.min(100, (left / DURATION) * 100)}%`;
  document.querySelector(".timer").classList.toggle("hurry", left > 0 && left <= 10000);
  const over = left <= 0;
  $("#answer-input").disabled = over;
  if (over && statusKey !== "timeUp") setStatus("timeUp");
}

// Le coffre : chaque réponse s'affiche tout de suite avec sa rareté et ses points, la plus récente en haut.
// Le total affiché est exactement celui que le joueur touchera à la fin de la manche.
function drawChips(fresh = -1) {
  const idx = indexFor(room.prompt);
  const items = myAnswers.map((a) => {
    const m = matchAnswer(idx, a);
    return { name: m ? m.names[lang] : a, tier: m ? m.tier : 0 };
  });
  const total = items.reduce((sum, x) => sum + pts(x.tier), 0);
  const n = items.length;
  $("#answer-count").innerHTML = n ? `<span>${t(n > 1 ? "answerMany" : "answerOne", { n })}</span><b>${total} ${t("pts")}</b>` : "";
  $("#my-answers").innerHTML = n
    ? items
        .map(
          (x, i) =>
            `<li class="t${x.tier}${i === fresh ? " new" : ""}"><div class="main"><span class="name">${esc(x.name)}</span><span class="tier">${t("tier" + x.tier)}</span></div><span class="pts">${x.tier ? "+" + pts(x.tier) : "0"}</span></li>`
        )
        .reverse()
        .join("")
    : `<li class="empty">${t("emptyVault")}</li>`;
  if (fresh >= 0) {
    const b = $("#answer-count b");
    if (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    if (items[fresh]?.tier === 1) confetti(18);
  }
}

$("#answer-form").onsubmit = (e) => {
  e.preventDefault();
  const input = $("#answer-input");
  if (!room || room.phase !== "play" || now() >= room.endsAt) return;
  const v = input.value.trim().slice(0, 40);
  if (!v) return;
  if (myAnswers.length >= 20) { input.value = ""; return toast(t("maxAnswers")); }
  // Une réponse absente de la liste est refusée : on garde le texte dans le champ pour qu'il puisse le corriger.
  const idx = indexFor(room.prompt);
  const hit = matchAnswer(idx, v);
  if (!hit) { input.select(); return toast(t("wrong", { v })); }
  input.value = "";
  if (myAnswers.some((a) => matchAnswer(idx, a) === hit)) return toast(t("already"));
  myAnswers.push(hit.id);
  drawChips(myAnswers.length - 1);
  saveAnswers();
};

function saveAnswers() {
  set(ref(db, `rooms/${code}/answers/r${room.round}/${uid}`), myAnswers.length ? myAnswers : null).catch(console.error);
}

function renderResults(isHost) {
  show("results");
  const list = room.results?.[`r${room.round}`] || [];
  $("#res-round").textContent = t("round", { n: room.round, total: ROUNDS });
  $("#res-prompt").textContent = promptText(room.prompt);
  // La révélation (réponses dévoilées une à une, la plus rare en dernier) ne se joue qu'une fois par manche
  const fresh = revealedRound !== room.round;
  revealedRound = room.round;
  $("#res-list").classList.toggle("reveal", fresh);
  if (fresh) recordRound(list);
  const gains = {};
  for (const r of list) for (const id of r.uids) gains[id] = (gains[id] || 0) + r.points;
  // Seules les 3 meilleures réponses de tout le salon sont affichées (la liste est triée de la plus rare à la moins rare)
  const top = list.filter((r) => r.points > 0).slice(0, 3);
  $("#res-list").innerHTML = top.length
    ? top
        .map((r, idx) => {
          const mine = r.uids.includes(uid);
          return `<li style="--i:${top.length - 1 - idx}" class="t${r.tier} ${mine ? "mine" : ""}">
            <div class="head"><span class="ans">${esc(answerName(room.prompt, r.answer))}</span><span class="pts">+${r.points}</span></div>
            <div class="badge">${t("tier" + r.tier)}</div>
            <div class="who">${r.uids.map((id) => esc(nameOf(id))).join(", ")}</div>
          </li>`;
        })
        .join("")
    : `<li class="t0"><span class="ans">${t("nobody")}</span></li>`;
  if (fresh && top.some((r) => r.tier === 1)) setTimeout(confetti, 700);
  $("#scoreboard").innerHTML = playersList()
    .sort((a, b) => b.score - a.score)
    .map((p) => {
      const g = gains[p.id] || 0;
      return `<li class="${p.id === uid ? "me" : ""}"><span>${esc(p.name)}</span><span class="gain${g ? "" : " zero"}">+${g}</span><span>${p.score}</span></li>`;
    })
    .join("");
  $("#btn-next").hidden = !isHost;
  $("#btn-next").textContent = t(room.round >= ROUNDS ? "showPodium" : "nextRound");
  $("#results-wait").hidden = isHost;
}

function renderEnd(isHost) {
  show("end");
  if (!endShown) {
    endShown = true;
    confetti(80);
    recordGame();
  }
  $("#podium").innerHTML = playersList()
    .sort((a, b) => b.score - a.score)
    .map((p) => `<li class="${p.id === uid ? "me" : ""}"><span>${esc(p.name)}</span><span>${p.score}</span></li>`)
    .join("");
  $("#btn-replay").hidden = !isHost;
}

/* ---------- Actions de l'hôte ---------- */
$("#btn-start").onclick = () => startRound();
$("#btn-next").onclick = () => (room.round >= ROUNDS ? update(roomRef(), { phase: "end" }) : startRound());
$("#btn-replay").onclick = () => {
  const up = { phase: "lobby", round: 0, used: "", results: null, answers: null };
  for (const p of playersList()) up[`players/${p.id}/score`] = 0;
  update(roomRef(), up);
};

async function startRound() {
  const used = (room.used || "").split(",").filter(Boolean).map(Number);
  // Seuls les thèmes qui ont une liste de réponses dans answers.js sont proposés
  const ready = PROMPTS.map((p, i) => ({ p, i })).filter(({ p }) => playable(p));
  if (!ready.length) return toast(t("noTheme"));
  let pool = ready.filter(({ i }) => !used.includes(i));
  if (!pool.length) pool = ready;
  const { p, i } = pool[Math.floor(Math.random() * pool.length)];
  await update(roomRef(), {
    phase: "play",
    round: (room.round || 0) + 1,
    prompt: p.id,
    endsAt: now() + DURATION,
    used: [...used, i].join(","),
  });
}

async function finishRound(round) {
  if (!room || room.phase !== "play" || room.round !== round) return;
  const snap = await get(ref(db, `rooms/${code}/answers/r${round}`));
  const list = computeResults(snap.val() || {}, indexFor(room.prompt));
  const up = { phase: "results", [`results/r${round}`]: list.length ? list : null };
  const gained = {};
  for (const r of list) for (const id of r.uids) gained[id] = (gained[id] || 0) + r.points;
  for (const p of playersList()) up[`players/${p.id}/score`] = p.score + (gained[p.id] || 0);
  await update(roomRef(), up);
}

/* ---------- Profil et statistiques (sauvegardés sur le compte du joueur) ---------- */
const statsRef = () => ref(db, `users/${uid}/stats`);
const recorded = new Set();

// Ajoute une manche ou une partie aux statistiques, une seule fois (même après un rechargement de page)
async function withStats(key, field, apply) {
  if (recorded.has(key)) return;
  recorded.add(key);
  try {
    const s = (await get(statsRef())).val() || {};
    if (s[field] === key) return;
    apply(s);
    s[field] = key;
    await set(statsRef(), s);
    if (profileData !== undefined) profileData = s;
  } catch (e) {
    console.error(e);
    recorded.delete(key);
  }
}

function recordRound(list) {
  const key = `${code}:${room.createdAt}:${room.round}`;
  const others = playersList().length > 1;
  const mine = list.filter((r) => r.uids.includes(uid));
  const gain = mine.reduce((n, r) => n + r.points, 0);
  return withStats(key, "last", (s) => {
    s.rounds = (s.rounds || 0) + 1;
    s.answers = (s.answers || 0) + mine.length;
    s.points = (s.points || 0) + gain;
    s.bestRound = Math.max(s.bestRound || 0, gain);
    s.tiers = s.tiers || {};
    for (const r of mine) {
      if (r.tier > 0) s.tiers[`t${r.tier}`] = (s.tiers[`t${r.tier}`] || 0) + 1;
      if (r.tier > 0 && (!s.rarest || r.tier < s.rarest.tier)) s.rarest = { p: room.prompt, a: r.answer, tier: r.tier };
      if (others && r.points > 0 && r.uids.length === 1) s.solo = (s.solo || 0) + 1;
    }
  });
}

function recordGame() {
  const key = `${code}:${room.createdAt}`;
  const scores = playersList().map((p) => p.score);
  const mine = room.players?.[uid]?.score || 0;
  return withStats(key, "lastGame", (s) => {
    s.games = (s.games || 0) + 1;
    if (mine > 0 && mine >= Math.max(...scores)) s.wins = (s.wins || 0) + 1;
  });
}

let profileData; // undefined = pas encore chargé, null = aucune statistique
const dlg = $("#profile");
$("#btn-profile").onclick = async () => {
  profileData = undefined;
  countedFor = undefined;
  renderProfile();
  dlg.showModal();
  try {
    profileData = (await get(statsRef())).val();
  } catch (e) {
    console.error(e);
    profileData = /permission/i.test(`${e.code} ${e.message}`) ? "rules" : false;
  }
  if (dlg.open) renderProfile();
};
$("#pf-close").onclick = () => dlg.close();
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("close", () => askLogout(false));

function renderProfile() {
  const name = $("#name").value.trim() || user.displayName || "";
  const s = typeof profileData === "object" && profileData ? profileData : {};
  const fmt = (n) => Math.round(n || 0).toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
  let body = `<div class="pf-head"><span class="av big" style="--h:${hue(name)}">${esc([...name][0]?.toUpperCase() || "?")}</span><h2 id="pf-name">${esc(name)}</h2></div>`;
  if (profileData === undefined) body += `<p class="muted">${t("pfLoading")}</p>`;
  else if (profileData === "rules") body += `<p class="muted">${t("pfRules")}</p>`;
  else if (profileData === false) body += `<p class="muted">${t("pfError")}</p>`;
  else if (!profileData || !s.rounds) body += `<p class="muted">${t("pfEmpty")}</p>`;
  else {
    const tile = (n, label) => `<div class="pf-tile"><b>${n}</b><span>${t(label)}</span></div>`;
    const rate = s.games ? Math.round(((s.wins || 0) / s.games) * 100) + "%" : "–";
    body += `<div class="pf-total"><svg viewBox="0 0 40 40" aria-hidden="true"><use href="#coin"/></svg><div><b id="pf-points" data-n="${s.points || 0}">${fmt(s.points)}</b><span>${t("pfPoints")}</span></div></div>`;
    body += `<div class="pf-grid">${tile(fmt(s.games), "pfGames")}${tile(fmt(s.wins), "pfWins")}${tile(rate, "pfWinRate")}</div>`;
    const chip = (tier) => `<span class="t${tier}"><svg viewBox="0 0 40 40"><use href="#coin2"/></svg><b>${fmt(s.tiers?.[`t${tier}`])}</b><i>${t("tier" + tier)}</i></span>`;
    body += `<h3>${t("pfByRarity")}</h3><div class="rarities">${[5, 4, 3, 2, 1].map(chip).join("")}</div>`;
  }
  body += `<p class="pf-note">${t("pfNote")}</p>`;
  $("#pf-body").innerHTML = body;
  countUp($("#pf-points"), fmt);
}

// Le compteur de points monte jusqu'au total à l'ouverture du profil
function countUp(el, fmt) {
  if (!el || calm || countedFor === profileData) return;
  countedFor = profileData;
  const end = Number(el.dataset.n);
  const start = performance.now();
  const step = (nowMs) => {
    const k = Math.min(1, (nowMs - start) / 900);
    el.textContent = fmt(end * (1 - Math.pow(1 - k, 3)));
    if (k < 1 && el.isConnected) requestAnimationFrame(step);
    else el.textContent = fmt(end);
  };
  requestAnimationFrame(step);
}
let countedFor;
