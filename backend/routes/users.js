import { Router } from "express";
import usersManager from "../usersManager.js";

const router = Router();

// ---------------------------------------------------------------------------
// POST /register  –  Create a new user account
// ---------------------------------------------------------------------------
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "El nombre de usuario y la contraseña son obligatorios" });
  }

  const result = usersManager.registerUser(username, password);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({
    message: "¡Usuario registrado correctamente!",
    user: result.user
  });
});

// ---------------------------------------------------------------------------
// POST /login  –  Login to an existing account and retrieve state
// ---------------------------------------------------------------------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "El nombre de usuario y la contraseña son obligatorios" });
  }

  const user = usersManager.authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ error: "Nombre de usuario o contraseña incorrectos" });
  }

  res.json({
    message: "Inicio de sesión correcto",
    user: {
      username: user.username,
      coins: user.coins,
      ownedPlayers: user.ownedPlayers,
      formation: user.formation,
      lineup: user.lineup
    }
  });
});

// ---------------------------------------------------------------------------
// POST /sync  –  Synchronize user coins, squad, formation, and pitch lineup
// ---------------------------------------------------------------------------
router.post("/sync", (req, res) => {
  const username = req.headers["x-username"];

  if (!username) {
    return res.status(401).json({ error: "No autorizado: Falta cabecera x-username" });
  }

  const result = usersManager.syncUser(username, req.body);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json({
    message: "Estado sincronizado correctamente",
    user: {
      username: result.user.username,
      coins: result.user.coins,
      ownedPlayers: result.user.ownedPlayers,
      formation: result.user.formation,
      lineup: result.user.lineup
    }
  });
});

export default router;
