import { useState, useMemo } from 'react';
import type { Player } from '../types';
import { CLUB_TEAMS } from '../data/teams';
import MatchSimulator from './MatchSimulator';
import { CalendarDays, ArrowLeft, Trophy, Play, Coins } from 'lucide-react';

interface LeagueProps {
  playerTeam: Player[];
  onReward: (amount: number) => void;
  onBack: () => void;
}

export interface LeagueTeam {
  id: string;
  name: string;
  isPlayer: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface LeagueMatchup {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
}

export default function League({ playerTeam, onReward, onBack }: LeagueProps) {
  const [phase, setPhase] = useState<'setup' | 'standings' | 'playing' | 'finished'>('setup');
  const [teams, setTeams] = useState<LeagueTeam[]>([]);
  const [fixtures, setFixtures] = useState<LeagueMatchup[][]>([]);
  const [currentMatchday, setCurrentMatchday] = useState(0);
  const [activeMatchup, setActiveMatchup] = useState<LeagueMatchup | null>(null);

  // Initialize League
  const startLeague = () => {
    // Pick 5 random national teams to form a 6-team league
    const shuffled = [...CLUB_TEAMS].sort(() => 0.5 - Math.random());
    const selectedBots = shuffled.slice(0, 5);
    
    const leagueTeams: LeagueTeam[] = [
      { id: 'player', name: 'Tu Equipo', isPlayer: true, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      ...selectedBots.map((t, idx) => ({
        id: `bot-${idx}`,
        name: t.name,
        isPlayer: false,
        played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0
      }))
    ];

    setTeams(leagueTeams);
    setFixtures(generateRoundRobin(leagueTeams));
    setCurrentMatchday(0);
    setPhase('standings');
  };

  const generateRoundRobin = (leagueTeams: LeagueTeam[]): LeagueMatchup[][] => {
    const n = leagueTeams.length; // 6
    const rounds = n - 1; // 5
    const matchesPerRound = n / 2; // 3
    
    let ids = leagueTeams.map(t => t.id);
    const generatedFixtures: LeagueMatchup[][] = [];

    for (let r = 0; r < rounds; r++) {
      const matchday: LeagueMatchup[] = [];
      for (let i = 0; i < matchesPerRound; i++) {
        const home = ids[i];
        const away = ids[n - 1 - i];
        // Alternate home/away based on round to be fair
        if (r % 2 === 0) {
          matchday.push({ id: `r${r}-m${i}`, homeTeamId: home, awayTeamId: away, played: false });
        } else {
          matchday.push({ id: `r${r}-m${i}`, homeTeamId: away, awayTeamId: home, played: false });
        }
      }
      generatedFixtures.push(matchday);
      
      // Rotate array (keep first element fixed)
      const first = ids[0];
      const rest = ids.slice(1);
      const last = rest.pop()!;
      rest.unshift(last);
      ids = [first, ...rest];
    }

    return generatedFixtures;
  };

  // Simulate bots matches mathematically
  const simulateBotMatch = (home: LeagueTeam, away: LeagueTeam): { h: number, a: number } => {
    // Add small variation based on if they are home or away
    let scoreA = Math.floor(Math.random() * 4);
    let scoreB = Math.floor(Math.random() * 4);
    if (home.name.length > away.name.length && Math.random() > 0.7) scoreA += 1;
    if (Math.random() > 0.8) scoreA += 1;
    if (Math.random() > 0.8) scoreB += 1;
    return { h: scoreA, a: scoreB };
  };

  const playPlayerMatch = () => {
    const currentMatches = fixtures[currentMatchday];
    const playerMatch = currentMatches.find(m => m.homeTeamId === 'player' || m.awayTeamId === 'player');
    if (playerMatch) {
      setActiveMatchup(playerMatch);
      setPhase('playing');
    }
  };

  const handleMatchEnd = (reward: number, result: any) => {
    onReward(reward);
    
    // We need to update everything: current matchday matches, and teams table
    const currentMatches = [...fixtures[currentMatchday]];
    const newTeams = [...teams];
    
    currentMatches.forEach(m => {
      let hScore = 0;
      let aScore = 0;

      if (m.homeTeamId === 'player' || m.awayTeamId === 'player') {
        // This was the played match
        // MatchSimulator always puts player as HOME inside its own logic,
        // but here we know who was home/away according to the league fixtures.
        if (m.homeTeamId === 'player') {
          hScore = result.score.home;
          aScore = result.score.away;
        } else {
          aScore = result.score.home;
          hScore = result.score.away;
        }
      } else {
        // Bot match
        const homeTeam = newTeams.find(t => t.id === m.homeTeamId)!;
        const awayTeam = newTeams.find(t => t.id === m.awayTeamId)!;
        const sim = simulateBotMatch(homeTeam, awayTeam);
        hScore = sim.h;
        aScore = sim.a;
      }

      m.homeScore = hScore;
      m.awayScore = aScore;
      m.played = true;

      // Update team stats
      const hTeam = newTeams.find(t => t.id === m.homeTeamId)!;
      const aTeam = newTeams.find(t => t.id === m.awayTeamId)!;

      hTeam.played += 1;
      aTeam.played += 1;
      hTeam.goalsFor += hScore;
      hTeam.goalsAgainst += aScore;
      aTeam.goalsFor += aScore;
      aTeam.goalsAgainst += hScore;

      if (hScore > aScore) {
        hTeam.won += 1;
        hTeam.points += 3;
        aTeam.lost += 1;
      } else if (hScore < aScore) {
        aTeam.won += 1;
        aTeam.points += 3;
        hTeam.lost += 1;
      } else {
        hTeam.drawn += 1;
        aTeam.drawn += 1;
        hTeam.points += 1;
        aTeam.points += 1;
      }
    });

    const newFixtures = [...fixtures];
    newFixtures[currentMatchday] = currentMatches;
    setFixtures(newFixtures);
    setTeams(newTeams);

    // Advance matchday
    if (currentMatchday + 1 < fixtures.length) {
      setCurrentMatchday(prev => prev + 1);
      setPhase('standings');
    } else {
      // League finished
      setPhase('finished');
      // Calculate reward based on position
      const finalStandings = [...newTeams].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        if (diffB !== diffA) return diffB - diffA;
        return b.goalsFor - a.goalsFor;
      });
      const playerPos = finalStandings.findIndex(t => t.id === 'player');
      
      let bonus = 0;
      if (playerPos === 0) bonus = 5000;
      else if (playerPos === 1) bonus = 2500;
      else if (playerPos === 2) bonus = 1000;
      else if (playerPos === 3) bonus = 500;
      
      if (bonus > 0) {
        setTimeout(() => onReward(bonus), 1000);
      }
    }
  };

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });
  }, [teams]);

  if (playerTeam.length < 5) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon"><CalendarDays size={48} /></div>
          <div className="empty-state-text">
            Necesitas al menos 5 jugadores en tu equipo para inscribirte en la Liga.
          </div>
          <button className="btn btn-secondary mt-4" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onBack}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'playing' && activeMatchup) {
    const opponentId = activeMatchup.homeTeamId === 'player' ? activeMatchup.awayTeamId : activeMatchup.homeTeamId;
    const opponent = teams.find(t => t.id === opponentId);
    const realTeam = CLUB_TEAMS.find(t => t.name === opponent?.name);

    return (
      <div>
        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>Jornada {currentMatchday + 1}</h3>
          <span style={{ color: 'var(--text-muted)' }}>MangaKick League</span>
        </div>
        <MatchSimulator 
          homeTeam={playerTeam} 
          overrideBotTeam={realTeam}
          onMatchEnd={(reward, result) => handleMatchEnd(reward, result)}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <CalendarDays className="text-neon-green" /> Modo <span className="highlight">Liga</span>
        </h2>
        <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onBack}>
          <ArrowLeft size={16} /> Volver a Torneos
        </button>
      </div>

      {phase === 'setup' && (
        <div className="glass-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-md)' }}><Trophy size={64} color="var(--neon-green)" /></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>
            ¡Bienvenido a la MangaKick League!
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
            Compite contra otros 5 equipos en un formato de liga corta (5 jornadas).
            Acumula puntos y corónate como el mejor para ganar jugosas recompensas en MC.
          </p>
          <button className="btn btn-primary btn-lg" onClick={startLeague}>
            Comenzar Temporada
          </button>
        </div>
      )}

      {(phase === 'standings' || phase === 'finished') && (
        <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Clasificación */}
          <div className="glass-card" style={{ flex: '2', minWidth: '350px', padding: 'var(--space-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)', color: 'var(--neon-gold)' }}>Clasificación</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Pos</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Equipo</th>
                    <th style={{ padding: '8px' }}>PJ</th>
                    <th style={{ padding: '8px' }}>V</th>
                    <th style={{ padding: '8px' }}>E</th>
                    <th style={{ padding: '8px' }}>D</th>
                    <th style={{ padding: '8px' }}>GF</th>
                    <th style={{ padding: '8px' }}>GC</th>
                    <th style={{ padding: '8px' }}>DG</th>
                    <th style={{ padding: '8px', color: 'var(--neon-green)' }}>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((team, idx) => (
                    <tr key={team.id} style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: team.isPlayer ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                      fontWeight: team.isPlayer ? 700 : 400
                    }}>
                      <td style={{ padding: '12px 8px', textAlign: 'left' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ whiteSpace: 'nowrap' }}>{team.name}</span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{team.played}</td>
                      <td style={{ padding: '12px 8px' }}>{team.won}</td>
                      <td style={{ padding: '12px 8px' }}>{team.drawn}</td>
                      <td style={{ padding: '12px 8px' }}>{team.lost}</td>
                      <td style={{ padding: '12px 8px' }}>{team.goalsFor}</td>
                      <td style={{ padding: '12px 8px' }}>{team.goalsAgainst}</td>
                      <td style={{ padding: '12px 8px' }}>{team.goalsFor - team.goalsAgainst}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--neon-green)', fontWeight: 700 }}>{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Siguiente Jornada / Resultados */}
          <div className="glass-card" style={{ flex: '1', minWidth: '300px', padding: 'var(--space-lg)' }}>
            {phase === 'finished' ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                <Trophy size={64} color="var(--neon-gold)" style={{ marginBottom: 'var(--space-md)', margin: '0 auto' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-sm)' }}>¡Fin de Temporada!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
                  Has terminado en la posición #{sortedTeams.findIndex(t => t.id === 'player') + 1}
                </p>
                {sortedTeams.findIndex(t => t.id === 'player') === 0 && (
                  <div style={{ color: 'var(--neon-gold)', fontWeight: 700, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    Premio: <Coins size={16} /> 5000 MC
                  </div>
                )}
                {sortedTeams.findIndex(t => t.id === 'player') === 1 && (
                  <div style={{ color: 'var(--neon-gold)', fontWeight: 700, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    Premio: <Coins size={16} /> 2500 MC
                  </div>
                )}
                <button className="btn btn-primary" onClick={startLeague}>Jugar Nueva Temporada</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)', color: 'var(--neon-blue)' }}>
                  Jornada {currentMatchday + 1} de {fixtures.length}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
                  {fixtures[currentMatchday].map(match => {
                    const home = teams.find(t => t.id === match.homeTeamId)!;
                    const away = teams.find(t => t.id === match.awayTeamId)!;
                    const isPlayerMatch = home.isPlayer || away.isPlayer;
                    return (
                      <div key={match.id} style={{ 
                        padding: '12px', 
                        background: isPlayerMatch ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-deepest)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: isPlayerMatch ? '1px solid var(--neon-green)' : '1px solid transparent'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, fontWeight: home.isPlayer ? 700 : 400 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>{home.name}</span>
                        </div>
                        <div style={{ padding: '2px 8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 700, margin: '0 8px' }}>
                          VS
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'flex-end', fontWeight: away.isPlayer ? 700 : 400 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>{away.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={playPlayerMatch}>
                  <Play size={18} /> Jugar tu partido
                </button>
              </>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
