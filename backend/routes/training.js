import { Router } from "express";
import db, { getPlayerById, calculateOverall } from "../database.js";
import usersManager from "../usersManager.js";

const router = Router();

// ---------------------------------------------------------------------------
// GET /drills  –  List all available training drills
// ---------------------------------------------------------------------------
router.get("/drills", (_req, res) => {
  res.json(db.trainingDrills);
});

// ---------------------------------------------------------------------------
// POST /train  –  Train a player with a specific drill
// ---------------------------------------------------------------------------
router.post("/train", (req, res) => {
  const { playerId, drillId } = req.body;
  const username = req.headers["x-username"];

  if (!playerId || !drillId) {
    return res.status(400).json({ error: "playerId and drillId are required" });
  }

  // Find player (mutable reference)
  let player;
  if (username) {
    const user = usersManager.getUser(username);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    player = user.ownedPlayers.find((p) => p.id === playerId);
    if (!player) {
      return res.status(404).json({ error: "Jugador no encontrado en tu equipo" });
    }
  } else {
    player = getPlayerById(playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
  }

  // Find drill
  const drill = db.trainingDrills.find((d) => d.id === drillId);
  if (!drill) {
    return res.status(404).json({ error: "Training drill not found" });
  }

  // ---- Apply stat boost --------------------------------------------------
  const { stat, amount } = drill.statBoost;
  if (player.stats[stat] !== undefined) {
    player.stats[stat] = Math.min(99, player.stats[stat] + amount);
  }

  // ---- Award XP & check level-up -----------------------------------------
  player.xp += drill.xpReward;
  const xpThreshold = player.level * 100;
  let leveledUp = false;

  if (player.xp >= xpThreshold && player.level < player.maxLevel) {
    player.level++;
    player.xp -= xpThreshold; // carry over excess XP

    // Level-up bonus: +1 to every stat (capped at 99)
    for (const key of Object.keys(player.stats)) {
      player.stats[key] = Math.min(99, player.stats[key] + 1);
    }
    leveledUp = true;
  }

  // Save changes if this is a user-aware call
  if (username) {
    usersManager.saveUsers();
  }

  res.json({
    message: leveledUp
      ? `${player.name} ha entrenado con "${drill.name}" y ha subido al nivel ${player.level}! 🎉`
      : `${player.name} completó el entrenamiento de "${drill.name}".`,
    player: { 
      ...player, 
      overall: calculateOverall(player.stats),
      type: player.anime ? "anime" : "football",
      source: player.anime || player.nationality || "Unknown"
    },
    drill,
    leveledUp,
    xpGained: drill.xpReward,
    nextLevelXp: player.level * 100,
  });
});

// ---------------------------------------------------------------------------
// POST /reset/:id  –  Reset a player's training to level 1
// ---------------------------------------------------------------------------
router.post("/reset/:id", (req, res) => {
  const username = req.headers["x-username"];
  const playerId = req.params.id;

  let player;
  if (username) {
    const user = usersManager.getUser(username);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    player = user.ownedPlayers.find((p) => p.id === playerId);
    if (!player) {
      return res.status(404).json({ error: "Jugador no encontrado en tu equipo" });
    }
  } else {
    player = getPlayerById(playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
  }

  // Find the original template to restore stats
  const original =
    db.animeCharacters.find((p) => p.id === player.id) ||
    db.realFootballers.find((p) => p.id === player.id);

  if (original) {
    player.stats = { ...original.stats };
  }
  player.level = 1;
  player.xp = 0;

  // Save changes if this is a user-aware call
  if (username) {
    usersManager.saveUsers();
  }

  res.json({
    message: `El entrenamiento de ${player.name} ha sido restablecido al nivel 1.`,
    player: { 
      ...player, 
      overall: calculateOverall(player.stats),
      type: player.anime ? "anime" : "football",
      source: player.anime || player.nationality || "Unknown"
    },
  });
});


export default router;
