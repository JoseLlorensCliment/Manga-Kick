// ---------------------------------------------------------------------------
// MangaKick – Image Loader
// Fetches real images from public APIs on startup and patches the database.
// Runs asynchronously so the server starts immediately with placeholders.
// ---------------------------------------------------------------------------

import axios from "axios";
import db from "./database.js";

const JIKAN_DELAY_MS = 400; // Jikan rate-limit: ~3 req/sec, we stay safe
const SPORTSDB_DELAY_MS = 250;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Map anime character names to their Jikan search queries for better results
const ANIME_SEARCH_MAP = {
  "Yoichi Isagi": "Isagi Yoichi",
  "Meguru Bachira": "Bachira Meguru",
  "Rin Itoshi": "Itoshi Rin",
  "Seishiro Nagi": "Nagi Seishiro",
  "Hyoma Chigiri": "Chigiri Hyoma",
  "Tsubasa Ozora": "Oozora Tsubasa",
  "Kojiro Hyuga": "Hyuga Kojirou",
  "Genzo Wakabayashi": "Wakabayashi Genzo",
  "Mamoru Endou": "Endou Mamoru",
  "Shuuya Gouenji": "Gouenji Shuuya",
  "Goku": "Son Goku",
  "Vegeta": "Vegeta",
  "Naruto Uzumaki": "Uzumaki Naruto",
  "Sasuke Uchiha": "Uchiha Sasuke",
  "Monkey D. Luffy": "Monkey D. Luffy",
  "Roronoa Zoro": "Roronoa Zoro",
  "Shoyo Hinata": "Hinata Shouyou",
  "Tetsuya Kuroko": "Kuroko Tetsuya",
  "Taiga Kagami": "Kagami Taiga",
  "Hanamichi Sakuragi": "Sakuragi Hanamichi",
};

/**
 * Fetch a character image from Jikan API (MyAnimeList)
 */
async function fetchAnimeImage(name, animeName) {
  try {
    const searchName = ANIME_SEARCH_MAP[name] || name;
    const { data } = await axios.get("https://api.jikan.moe/v4/characters", {
      params: { q: searchName, limit: 5 },
      timeout: 5000,
    });

    const results = data?.data || [];
    // Strict match by name or if the about text contains the anime name
    const character = results.find(c => 
      c.name.toLowerCase() === searchName.toLowerCase() ||
      (c.about && animeName && c.about.toLowerCase().includes(animeName.toLowerCase()))
    ) || results[0];

    if (character?.images?.jpg?.image_url) {
      return character.images.jpg.image_url;
    }
  } catch (err) {
    // Silently ignore – we keep the placeholder
  }
  return null;
}

/**
 * Fetch a player thumbnail from TheSportsDB
 */
async function fetchFootballerImage(name, nationality) {
  try {
    const { data } = await axios.get(
      "https://www.thesportsdb.com/api/v1/json/3/searchplayers.php",
      { params: { p: name }, timeout: 5000 }
    );

    const results = data?.player || [];
    // Strict match by exact name and nationality (or team)
    const player = results.find(p => 
      p.strPlayer.toLowerCase() === name.toLowerCase() &&
      (p.strNationality?.toLowerCase() === nationality.toLowerCase() || 
       p.strTeam?.toLowerCase().includes(nationality.toLowerCase()))
    ) || results.find(p => p.strPlayer.toLowerCase() === name.toLowerCase()) || results[0];

    if (player) {
      // Prefer cutout, then thumb, then fanart
      return player.strCutout || player.strThumb || player.strRender || null;
    }
  } catch (err) {
    // Silently ignore
  }
  return null;
}

/**
 * Load all images asynchronously – call once at startup.
 */
export async function loadAllImages() {
  console.log("🖼️  Loading player images from public APIs...");

  let animeLoaded = 0;
  let footballLoaded = 0;

  // --- Anime characters ---
  for (const character of db.animeCharacters) {
    const imageUrl = await fetchAnimeImage(character.name, character.anime);
    if (imageUrl) {
      character.image = imageUrl;
      animeLoaded++;
    }
    await sleep(JIKAN_DELAY_MS);
  }

  console.log(`🎌  Anime images loaded: ${animeLoaded}/${db.animeCharacters.length}`);

  // --- Real footballers ---
  for (const player of db.realFootballers) {
    const imageUrl = await fetchFootballerImage(player.name, player.nationality);
    if (imageUrl) {
      player.image = imageUrl;
      footballLoaded++;
    }
    await sleep(SPORTSDB_DELAY_MS);
  }

  console.log(`⚽  Football images loaded: ${footballLoaded}/${db.realFootballers.length}`);
  console.log(`🖼️  Image loading complete! (${animeLoaded + footballLoaded}/40 players)`);
}
