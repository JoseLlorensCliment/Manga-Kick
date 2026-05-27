const API_BASE = 'http://localhost:5000/api';

let activeUsername: string | null = null;

export function setActiveUsername(username: string | null) {
  activeUsername = username;
}

function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  if (activeUsername) {
    headers['x-username'] = activeUsername;
  }
  return headers;
}

export async function fetchAllPlayers() {
  const res = await fetch(`${API_BASE}/players`);
  if (!res.ok) throw new Error('Failed to fetch players');
  return res.json();
}

export async function searchPlayers(query: string, type: 'anime' | 'football') {
  const res = await fetch(`${API_BASE}/players/search?query=${encodeURIComponent(query)}&type=${type}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function fetchPlayerById(id: string) {
  const res = await fetch(`${API_BASE}/players/${id}`);
  if (!res.ok) throw new Error('Player not found');
  return res.json();
}

export async function simulateMatch(homeTeam: unknown[], awayTeam: unknown[]) {
  const res = await fetch(`${API_BASE}/match/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ homeTeam, awayTeam }),
  });
  if (!res.ok) throw new Error('Simulation failed');
  return res.json();
}

export async function fetchDrills() {
  const res = await fetch(`${API_BASE}/training/drills`);
  if (!res.ok) throw new Error('Failed to fetch drills');
  return res.json();
}

export async function trainPlayer(playerId: string, drillId: string) {
  const res = await fetch(`${API_BASE}/training/train`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ playerId, drillId }),
  });
  if (!res.ok) throw new Error('Training failed');
  return res.json();
}

export async function resetTraining(playerId: string) {
  const res = await fetch(`${API_BASE}/training/reset/${playerId}`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Reset failed');
  return res.json();
}

// ---------------------------------------------------------------------------
// User Accounts & Sincronización
// ---------------------------------------------------------------------------

export async function registerUser(username: string, password: string) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function syncUserState(state: {
  coins: number;
  ownedPlayers: unknown[];
  formation: string;
  lineup: unknown[];
}) {
  const res = await fetch(`${API_BASE}/users/sync`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(state),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Sync failed');
  return data;
}
