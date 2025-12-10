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
   CONFIG
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
