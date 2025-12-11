const API_BASE_URL = "http://localhost:8080/casino/documents";

/* ============================================================
   HELPER
============================================================ */

async function getAllRaw() {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("API Fehler (GET)");
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.documents)) return data.documents;
  return [];
}

async function post(content) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error("POST Fehler");
  const json = await res.json().catch(() => null);
  return json ? mapDoc(json) : { ...content };
}

async function del(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("DELETE Fehler");
  return {};
}

function getDocId(doc) {
  return doc._id || doc.id;
}

function mapDoc(doc) {
  if (!doc) return null;
  return {
    id: getDocId(doc),
    ...doc.content
  };
}

async function getDocByType(type) {
  const docs = await getAllRaw();
  return docs.find((d) => d.content?.type === type) || null;
}

/* ============================================================
   USER
============================================================ */

export async function getCurrentUser() {
  const raw = await getDocByType("user");
  return raw ? mapDoc(raw) : null;
}

export async function createDemoUser() {
  return post({
    type: "user",
    name: "Demo User",
    balance: 100
  });
}

// UPDATE = DELETE + POST
export async function updateUserBalance(_idIgnored, balance) {
  const raw = await getDocByType("user");
  if (raw) await del(getDocId(raw));

  return post({
    type: "user",
    name: raw?.content?.name || "Demo User",
    balance
  });
}

export async function deleteDemoUser() {
  const raw = await getDocByType("user");
  if (!raw) return {};
  return del(getDocId(raw));
}

/* ============================================================
   GAME CONFIG (allgemein)
============================================================ */

export async function getGameConfig() {
  const raw = await getDocByType("config");
  return raw ? mapDoc(raw) : null;
}

export async function createDefaultConfig() {
  return post({
    type: "config",
    gameCost: 10,
    winChance: 0.5,
    winMultiplier: 2
  });
}

// UPDATE CONFIG = DELETE + POST
export async function updateGameConfig(cfg) {
  const raw = await getDocByType("config");
  if (raw) await del(getDocId(raw));

  return post({
    type: "config",
    gameCost: cfg.gameCost,
    winChance: cfg.winChance,
    winMultiplier: cfg.winMultiplier
  });
}

/* ============================================================
   SLOT CONFIG (fuer SlotPage / AdminSlot)
============================================================ */

export async function getSlotConfig() {
  const raw = await getDocByType("slotConfig");
  return raw ? mapDoc(raw) : null;
}

// optional, falls du bei Serverstart eine Default-Config anlegen willst
export async function createDefaultSlotConfig() {
  return post({
    type: "slotConfig",
    reels: 5,
    rows: 3,
    paylines: 5,
    baseBets: [0.05, 0.10, 0.20, 0.30, 0.50],
    symbolWeights: {
      watermelon: 8,
      plum: 9,
      cherry: 10,
      orange: 10,
      grapes: 7,
      lemon: 11,
      bell: 4,
      crown: 2,
      seven: 1
    },
    freeSpins: {
      enabled: true,
      triggerSymbol: "crown",
      triggerCount: 3,
      spins: 10,
      multiplier: 2
    },
    bigWinMultipliers: {
      big: 15,
      mega: 30,
      ultra: 60
    }
  });
}

// UPDATE SLOT CONFIG = DELETE + POST
export async function updateSlotConfig(cfg) {
  const raw = await getDocByType("slotConfig");
  if (raw) await del(getDocId(raw));

  // cfg kommt direkt aus AdminSlot.jsx (enthält reels, rows, usw.)
  return post({
    type: "slotConfig",
    ...cfg
  });
}
