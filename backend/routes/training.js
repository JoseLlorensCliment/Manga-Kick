import { Router } from "express";
import db, { getPlayerById, calculateOverall } from "../database.js";

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

  if (!playerId || !drillId) {
    return res.status(400).json({ error: "playerId and drillId are required" });
  }

  // Find player (mutable reference in the in-memory DB)
  const player = getPlayerById(playerId);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
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

  res.json({
    message: leveledUp
      ? `${player.name} trained with "${drill.name}" and leveled up to level ${player.level}! 🎉`
      : `${player.name} completed "${drill.name}" training.`,
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
  const player = getPlayerById(req.params.id);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  // Find the original template to restore stats
  const original =
    db.animeCharacters.find((p) => p.id === player.id) ||
    db.realFootballers.find((p) => p.id === player.id);

  // We can't restore originals since we mutate in-place, so just reset level/xp
  player.level = 1;
  player.xp = 0;

  res.json({
    message: `${player.name}'s training progress has been reset to level 1.`,
    player: { 
      ...player, 
      overall: calculateOverall(player.stats),
      type: player.anime ? "anime" : "football",
      source: player.anime || player.nationality || "Unknown"
    },
  });
});

export default router;
