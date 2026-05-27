import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Ensure data folder and users.json exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({}), "utf8");
}

class UsersManager {
  constructor() {
    this.users = {};
    this.loadUsers();
  }

  loadUsers() {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      this.users = JSON.parse(data || "{}");
    } catch (err) {
      console.error("Error loading users database file:", err);
      this.users = {};
    }
  }

  saveUsers() {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), "utf8");
    } catch (err) {
      console.error("Error saving users database file:", err);
    }
  }

  getUser(username) {
    const key = username.trim().toLowerCase();
    return this.users[key] || null;
  }

  registerUser(username, password) {
    const rawUsername = username.trim();
    const key = rawUsername.toLowerCase();

    if (this.getUser(key)) {
      return { error: "El nombre de usuario ya existe" };
    }

    const newUser = {
      username: rawUsername,
      password: password, // For an educational project, plain text or simple encoding is sufficient
      coins: 3000,
      ownedPlayers: [],
      formation: "1-2-2",
      lineup: [
        { id: "slot-0", position: "GK", player: null },
        { id: "slot-1", position: "DEF", player: null },
        { id: "slot-2", position: "MID", player: null },
        { id: "slot-3", position: "FWD", player: null },
        { id: "slot-4", position: "FWD", player: null }
      ]
    };

    this.users[key] = newUser;
    this.saveUsers();
    return { user: newUser };
  }

  authenticateUser(username, password) {
    const user = this.getUser(username);
    if (!user) return null;
    if (user.password !== password) return null;
    return user;
  }

  syncUser(username, state) {
    const key = username.trim().toLowerCase();
    const user = this.users[key];
    if (!user) return { error: "Usuario no encontrado" };

    // Update state fields
    if (state.coins !== undefined) user.coins = state.coins;
    if (state.ownedPlayers !== undefined) user.ownedPlayers = state.ownedPlayers;
    if (state.formation !== undefined) user.formation = state.formation;
    if (state.lineup !== undefined) user.lineup = state.lineup;

    this.saveUsers();
    return { user };
  }
}

const usersManager = new UsersManager();
export default usersManager;
