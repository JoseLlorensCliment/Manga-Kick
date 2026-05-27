import { Router } from "express";
import { calculateOverall } from "../database.js";

const router = Router();

// ---------------------------------------------------------------------------
// POST /simulate  –  Run a 5 v 5 mini-match simulation
// ---------------------------------------------------------------------------
router.post("/simulate", (req, res) => {
  const { homeTeam, awayTeam } = req.body;

  // ---- Validation --------------------------------------------------------
  if (!Array.isArray(homeTeam) || !Array.isArray(awayTeam)) {
    return res.status(400).json({ error: "homeTeam and awayTeam must be arrays" });
  }
  if (homeTeam.length !== 5 || awayTeam.length !== 5) {
    return res.status(400).json({ error: "Each team must have exactly 5 players" });
  }

  try {
    const result = simulateMatch(homeTeam, awayTeam);
    res.json(result);
  } catch (err) {
    console.error("Simulation error:", err);
    res.status(500).json({ error: "Match simulation failed" });
  }
});

// ===========================================================================
//  SIMULATION ENGINE
// ===========================================================================

function simulateMatch(homeTeam, awayTeam) {
  const events = [];
  const score = { home: 0, away: 0 };
  const matchStats = {
    home: { possession: 0, shots: 0, shotsOnTarget: 0, fouls: 0, specialAbilities: 0 },
    away: { possession: 0, shots: 0, shotsOnTarget: 0, fouls: 0, specialAbilities: 0 },
  };

  // Pre-compute team strength values
  const homeStrength = computeTeamStrength(homeTeam);
  const awayStrength = computeTeamStrength(awayTeam);

  // Possession is roughly proportional to combined passing + dribbling
  const homePossBase = homeStrength.passing + homeStrength.dribbling;
  const awayPossBase = awayStrength.passing + awayStrength.dribbling;
  const totalPoss = homePossBase + awayPossBase;
  matchStats.home.possession = Math.round((homePossBase / totalPoss) * 100);
  matchStats.away.possession = 100 - matchStats.home.possession;

  // Simulate 90 minutes in ~10-minute chunks
  for (let minute = 5; minute <= 90; minute += randInt(7, 13)) {
    // Determine which team is attacking this phase
    const homeAttacks = Math.random() < homePossBase / totalPoss;
    const attackingTeam = homeAttacks ? homeTeam : awayTeam;
    const defendingTeam = homeAttacks ? awayTeam : homeTeam;
    const side = homeAttacks ? "home" : "away";
    const defSide = homeAttacks ? "away" : "home";

    // Pick random attacker & defender
    const attacker = pickRandom(attackingTeam);
    const defender = pickRandom(defendingTeam);

    // ---- Special Ability Trigger? ----------------------------------------
    const abilityChance = (attacker.specialAbility?.power || 5) / 100 + 0.08;
    if (Math.random() < abilityChance) {
      matchStats[side].specialAbilities++;
      events.push({
        minute,
        type: "special_ability_triggered",
        player: attacker.name,
        team: side,
        description: `⚡ ${attacker.name} activates "${attacker.specialAbility?.name}"! ${attacker.specialAbility?.description}`,
      });
      // Temporary stat boost for this phase
      attacker._boosted = true;
    }

    // ---- Foul chance -----------------------------------------------------
    if (Math.random() < 0.15) {
      matchStats[defSide].fouls++;
      events.push({
        minute,
        type: "foul",
        player: defender.name,
        team: defSide,
        description: `🟡 ${defender.name} commits a foul on ${attacker.name}.`,
      });
    }

    // ---- Shot attempt ----------------------------------------------------
    const shotChance = computeShotChance(attacker, homeAttacks ? homeStrength : awayStrength);
    if (Math.random() < shotChance) {
      matchStats[side].shots++;

      // On target?
      const accuracy = ((attacker.stats?.shooting || 70) + (attacker._boosted ? 15 : 0)) / 120;
      if (Math.random() < accuracy) {
        matchStats[side].shotsOnTarget++;

        // ---- Save attempt ------------------------------------------------
        const gk = findGoalkeeper(defendingTeam);
        const saveChance = computeSaveChance(gk, attacker);

        if (Math.random() < saveChance) {
          events.push({
            minute,
            type: "save",
            player: gk.name,
            team: defSide,
            description: `🧤 Great save by ${gk.name}! Denies ${attacker.name}'s effort.`,
          });
        } else {
          // GOAL!
          score[side]++;
          events.push({
            minute,
            type: "goal",
            player: attacker.name,
            team: side,
            description: `⚽ GOAL! ${attacker.name} scores${attacker._boosted ? " with a special-ability-powered shot" : ""}! (${score.home}-${score.away})`,
          });
        }
      }
    }

    // ---- Injury chance (rare) --------------------------------------------
    if (Math.random() < 0.03) {
      const injured = pickRandom(homeAttacks ? defendingTeam : attackingTeam);
      const injSide = homeAttacks ? defSide : side;
      events.push({
        minute,
        type: "injury",
        player: injured.name,
        team: injSide,
        description: `🏥 ${injured.name} picks up a knock and is struggling to continue.`,
      });

      // Possible forced substitution
      if (Math.random() < 0.5) {
        events.push({
          minute: minute + 1,
          type: "substitution_forced",
          player: injured.name,
          team: injSide,
          description: `🔄 ${injured.name} is forced off due to injury.`,
        });
      }
    }

    // Reset boost flag
    if (attacker._boosted) delete attacker._boosted;
  }

  // ---- Player of the Match -----------------------------------------------
  const allPlayers = [...homeTeam, ...awayTeam];
  const goalScorers = events
    .filter((e) => e.type === "goal")
    .reduce((acc, e) => {
      acc[e.player] = (acc[e.player] || 0) + 1;
      return acc;
    }, {});

  let potm = allPlayers[0];
  let bestScore = -1;
  for (const p of allPlayers) {
    const goals = goalScorers[p.name] || 0;
    const overall = calculateOverall(p.stats || {});
    const score = goals * 30 + overall + Math.random() * 10;
    if (score > bestScore) {
      bestScore = score;
      potm = p;
    }
  }

  return {
    score,
    events,
    stats: matchStats,
    playerOfTheMatch: {
      ...potm,
      overall: calculateOverall(potm.stats || {}),
    },
  };
}

// ===========================================================================
//  HELPER UTILITIES
// ===========================================================================

function computeTeamStrength(team) {
  const avg = (stat) => {
    const vals = team.map((p) => p.stats?.[stat] || 50);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };
  return {
    pace: avg("pace"),
    shooting: avg("shooting"),
    passing: avg("passing"),
    dribbling: avg("dribbling"),
    defense: avg("defense"),
    physical: avg("physical"),
  };
}

function computeShotChance(player, teamStrength) {
  const shooting = player.stats?.shooting || 60;
  const pace = player.stats?.pace || 60;
  const boost = player._boosted ? 10 : 0;
  // Base chance ~ 35-55 %
  return 0.20 + ((shooting + pace + boost) / 200) * 0.40 + (teamStrength.passing / 100) * 0.10;
}

function computeSaveChance(gk, attacker) {
  const gkDef = gk.stats?.defense || 50;
  const gkPhys = gk.stats?.physical || 50;
  const atkShoot = attacker.stats?.shooting || 70;
  const boost = attacker._boosted ? -15 : 0;
  // Save probability between ~20 % and ~60 %
  return Math.min(0.65, Math.max(0.15, ((gkDef + gkPhys) / 2 - atkShoot + boost) / 100 + 0.40));
}

function findGoalkeeper(team) {
  return team.find((p) => p.position === "GK") || team[team.length - 1];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default router;
