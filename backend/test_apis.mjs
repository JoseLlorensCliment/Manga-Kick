import axios from 'axios';

async function test() {
  // Test Jikan
  const { data: jikanData } = await axios.get("https://api.jikan.moe/v4/characters?q=Isagi Yoichi");
  console.log("Jikan 'Isagi Yoichi' first 2 results:");
  jikanData.data.slice(0, 2).forEach(c => {
    console.log(`- ${c.name} | about length: ${c.about?.length} | nicknames: ${c.nicknames?.join(', ')}`);
    console.log(`  About snippet: ${c.about?.substring(0, 100).replace(/\n/g, ' ')}`);
  });

  // Test TheSportsDB
  const { data: sportsData } = await axios.get("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=Pedri");
  console.log("\nSportsDB 'Pedri' first 2 results:");
  sportsData.player?.slice(0, 2).forEach(p => {
    console.log(`- ${p.strPlayer} | Nationality: ${p.strNationality} | Team: ${p.strTeam}`);
  });
}

test().catch(console.error);
