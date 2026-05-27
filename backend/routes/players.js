import { Router } from "express";
import axios from "axios";
import { getAllPlayers, getPlayerById, calculateOverall } from "../database.js";

const router = Router();

// ---------------------------------------------------------------------------
// GET /  –  Return every player with an overall rating attached
// ---------------------------------------------------------------------------
router.get("/", (_req, res) => {
  try {
    const players = getAllPlayers().map((p) => ({
      ...p,
      overall: calculateOverall(p.stats),
      type: p.anime ? "anime" : "football",
      source: p.anime || p.nationality || "Unknown",
    }));
    res.json(players);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// ---------------------------------------------------------------------------
// GET /search?query=...&type=anime|football  –  External API search
// ---------------------------------------------------------------------------
router.get("/search", async (req, res) => {
  const { query, type } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter" });
  }

  try {
    if (type === "football") {
      // ---- TheSportsDB --------------------------------------------------
      const { data } = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php`,
        { params: { p: query } }
      );

      const queryParts = query.toLowerCase().split(/\s+/);
      const searchResults = (data.player || []).filter(p => {
        const name = p.strPlayer.toLowerCase();
        return queryParts.every(part => name.includes(part));
      });

      const results = searchResults.slice(0, 5).map((p, idx) => {
        const isFwd = /forward|striker|attacker/i.test(p.strPosition || "");
        const isMid = /midfielder|midfield/i.test(p.strPosition || "");
        const isDef = /defender|back/i.test(p.strPosition || "");
        const isGk  = /keeper|goalkeeper/i.test(p.strPosition || "");
        const position = isGk ? "GK" : isDef ? "DEF" : isMid ? "MID" : isFwd ? "FWD" : "MID";

        return {
          id: `search-football-${Date.now()}-${idx}`,
          name: p.strPlayer,
          anime: null,
          type: "football",
          source: p.strTeam || p.strNationality || "Unknown",
          image: p.strThumb || `https://placehold.co/300x400?text=${encodeURIComponent(p.strPlayer)}`,
          position,
          nationality: p.strNationality || "Unknown",
          stats: {
            pace:      randStat(65, 95),
            shooting:  randStat(60, 95),
            passing:   randStat(60, 95),
            dribbling: randStat(60, 95),
            defense:   position === "DEF" || position === "GK" ? randStat(75, 95) : randStat(25, 60),
            physical:  randStat(60, 90),
          },
          specialAbility: {
            name: `${p.strPlayer}'s Signature`,
            description: `A move unique to ${p.strPlayer} honed over years of professional play.`,
            power: randInt(6, 9),
          },
          rarity: pickRarity(),
          level: 1,
          xp: 0,
          maxLevel: 10,
        };
      });

      return res.json(results);
    }

    // ---- Jikan API (anime characters) ----------------------------------
    const { data } = await axios.get(
      "https://api.jikan.moe/v4/characters",
      { params: { q: query, limit: 5 } }
    );

    const queryParts = query.toLowerCase().split(/\s+/);
    const searchResults = (data.data || []).filter(c => {
      const name = c.name.toLowerCase();
      return queryParts.every(part => name.includes(part));
    });

    const results = searchResults.slice(0, 5).map((c, idx) => {
      const positions = ["GK", "DEF", "MID", "FWD"];
      const position = positions[Math.floor(Math.random() * positions.length)];

      return {
        id: `search-anime-${Date.now()}-${idx}`,
        name: c.name,
        anime: c.nicknames?.[0] || "Unknown Anime",
        type: "anime",
        source: c.nicknames?.[0] || "Unknown Anime",
        image: c.images?.jpg?.image_url || `https://placehold.co/300x400?text=${encodeURIComponent(c.name)}`,
        position,
        nationality: "Anime World",
        stats: {
          pace:      randStat(50, 95),
          shooting:  randStat(45, 92),
          passing:   randStat(45, 92),
          dribbling: randStat(50, 95),
          defense:   randStat(30, 85),
          physical:  randStat(40, 95),
        },
        specialAbility: {
          name: `${c.name}'s Secret Technique`,
          description: `A hidden ability known only to ${c.name}.`,
          power: randInt(5, 10),
        },
        rarity: pickRarity(),
        level: 1,
        xp: 0,
        maxLevel: 10,
      };
    });

    return res.json(results);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(502).json({ error: "External API request failed", details: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /:id  –  Single player by ID
// ---------------------------------------------------------------------------
router.get("/:id", (req, res) => {
  const player = getPlayerById(req.params.id);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.json({ ...player, overall: calculateOverall(player.stats), type: player.anime ? "anime" : "football", source: player.anime || player.nationality || "Unknown" });
});

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------
function randStat(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pickRarity() {
  const roll = Math.random();
  if (roll < 0.05) return "legendary";
  if (roll < 0.20) return "epic";
  if (roll < 0.50) return "rare";
  return "common";
}

export default router;
