import { useState } from 'react';
import type { Player } from '../types';
import { NATIONAL_TEAMS, type Team } from '../data/teams';
import MatchSimulator from './MatchSimulator';
import { Globe, ArrowLeft, Trophy, Play, HeartCrack, Crown, Coins } from 'lucide-react';

interface WorldCupProps {
  playerTeam: Player[];
  onReward: (amount: number) => void;
  onBack: () => void;
}

interface Matchup {
  id: string;
  teamA: Team | 'player';
  teamB: Team | 'player';
  winner: Team | 'player' | null;
  scoreA?: number;
  scoreB?: number;
}

export default function WorldCup({ playerTeam, onReward, onBack }: WorldCupProps) {
  const [phase, setPhase] = useState<'setup' | 'bracket' | 'playing' | 'eliminated' | 'champion'>('setup');
  const [rounds, setRounds] = useState<Matchup[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [activeMatchup, setActiveMatchup] = useState<Matchup | null>(null);

  // Initialize Tournament
  const startTournament = () => {
    // Pick 7 random national teams
    const shuffled = [...NATIONAL_TEAMS].sort(() => 0.5 - Math.random());
    const selectedBots = shuffled.slice(0, 7);
    
    // Quarterfinals
    const qf: Matchup[] = [
      { id: 'qf1', teamA: 'player', teamB: selectedBots[0], winner: null },
      { id: 'qf2', teamA: selectedBots[1], teamB: selectedBots[2], winner: null },
      { id: 'qf3', teamA: selectedBots[3], teamB: selectedBots[4], winner: null },
      { id: 'qf4', teamA: selectedBots[5], teamB: selectedBots[6], winner: null },
    ];

    setRounds([qf]);
    setCurrentRound(0);
    setPhase('bracket');
  };

  const getTeamName = (team: Team | 'player') => team === 'player' ? 'Tu Equipo' : team.name;

  // Simulate bots matches mathematically
  const simulateBotMatch = (matchup: Matchup) => {
    if (matchup.teamA === 'player' || matchup.teamB === 'player') return; // Handled by actual simulator
    // Simple random score with slight OVR bias (if we had OVR, but let's just do random)
    let scoreA = Math.floor(Math.random() * 4);
    let scoreB = Math.floor(Math.random() * 4);
    if (scoreA === scoreB) scoreA += 1; // No ties in knockout
    
    matchup.scoreA = scoreA;
    matchup.scoreB = scoreB;
    matchup.winner = scoreA > scoreB ? matchup.teamA : matchup.teamB;
  };

  const playPlayerMatch = () => {
    const currentMatches = rounds[currentRound];
    const playerMatch = currentMatches.find(m => m.teamA === 'player' || m.teamB === 'player');
    if (playerMatch) {
      setActiveMatchup(playerMatch);
      setPhase('playing');
    }
  };

  const handleMatchEnd = (reward: number, result: any) => {
    onReward(reward);
    // Determine winner based on match result score
    const playerWon = result.score.home > result.score.away;
    const currentMatches = [...rounds[currentRound]];
    const playerMatchIdx = currentMatches.findIndex(m => m.id === activeMatchup?.id);
    
    if (playerMatchIdx !== -1) {
      currentMatches[playerMatchIdx].scoreA = result.score.home; // Player is always home in simulator
      currentMatches[playerMatchIdx].scoreB = result.score.away;
      currentMatches[playerMatchIdx].winner = playerWon ? 'player' : activeMatchup!.teamB;
    }

    // Simulate rest of matches
    currentMatches.forEach(m => {
      if (m.teamA !== 'player' && m.teamB !== 'player') {
        simulateBotMatch(m);
      }
    });

    const newRounds = [...rounds];
    newRounds[currentRound] = currentMatches;
    setRounds(newRounds);

    if (!playerWon) {
      setPhase('eliminated');
    } else {
      // Advance to next round
      if (currentRound === 0) { // QF to SF
        const sf: Matchup[] = [
          { id: 'sf1', teamA: currentMatches[0].winner!, teamB: currentMatches[1].winner!, winner: null },
          { id: 'sf2', teamA: currentMatches[2].winner!, teamB: currentMatches[3].winner!, winner: null },
        ];
        newRounds.push(sf);
        setCurrentRound(1);
        setPhase('bracket');
      } else if (currentRound === 1) { // SF to F
        const finalMatch: Matchup[] = [
          { id: 'f1', teamA: currentMatches[0].winner!, teamB: currentMatches[1].winner!, winner: null },
        ];
        newRounds.push(finalMatch);
        setCurrentRound(2);
        setPhase('bracket');
      } else {
        // Won the final!
        setPhase('champion');
        onReward(2500); // Big bonus
      }
    }
  };

  const roundNames = ['Cuartos de Final', 'Semifinales', 'Gran Final'];

  if (playerTeam.length < 5) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon"><Globe size={48} /></div>
          <div className="empty-state-text">
            Necesitas al menos 5 jugadores en tu equipo para inscribirte en el Mundial.
          </div>
          <button className="btn btn-secondary mt-4" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onBack}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'playing' && activeMatchup) {
    const opponent = activeMatchup.teamA === 'player' ? activeMatchup.teamB : activeMatchup.teamA;
    return (
      <div>
        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)' }}>{roundNames[currentRound]}</h3>
          <span style={{ color: 'var(--text-muted)' }}>Mundial MangaKick</span>
        </div>
        <MatchSimulator 
          homeTeam={playerTeam} 
          overrideBotTeam={opponent !== 'player' ? (opponent as Team) : undefined}
          onMatchEnd={(reward, result) => handleMatchEnd(reward, result)}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe className="text-neon-blue" /> Copa <span className="highlight">Mundial</span>
        </h2>
        <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onBack}>
          <ArrowLeft size={16} /> Volver a Torneos
        </button>
      </div>

      {phase === 'setup' && (
        <div className="glass-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-md)' }}><Trophy size={64} color="var(--neon-gold)" /></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>
            ¡Bienvenido al Mundial!
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
            Lleva a tu equipo a la gloria enfrentándote a las 7 mejores selecciones del mundo. 
            Gana 3 partidos seguidos para coronarte campeón y ganar una jugosa recompensa.
          </p>
          <button className="btn btn-primary btn-lg" onClick={startTournament}>
            Inscribir Equipo y Sortear Cuadros
          </button>
        </div>
      )}

      {phase === 'bracket' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', color: 'var(--neon-gold)', marginBottom: 'var(--space-lg)' }}>
            {roundNames[currentRound]}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
            {rounds[currentRound].map((match) => (
              <div key={match.id} className="glass-card" style={{ padding: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flex: 1, fontWeight: match.winner === match.teamA ? 700 : 400, opacity: match.winner === match.teamB ? 0.5 : 1 }}>
                  <span>{getTeamName(match.teamA)}</span>
                </div>
                <div style={{ padding: '4px 12px', background: 'var(--bg-deepest)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {match.winner ? `${match.scoreA} - ${match.scoreB}` : 'VS'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flex: 1, justifyContent: 'flex-end', fontWeight: match.winner === match.teamB ? 700 : 400, opacity: match.winner === match.teamA ? 0.5 : 1 }}>
                  <span>{getTeamName(match.teamB)}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }} onClick={playPlayerMatch}>
              <Play size={20} /> Jugar tu Partido
            </button>
          </div>
        </div>
      )}

      {phase === 'eliminated' && (
        <div className="glass-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-md)' }}><HeartCrack size={64} color="var(--danger)" /></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>
            ¡Eliminado!
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
            Has caído en {roundNames[currentRound]}. Entrena a tus jugadores e inténtalo de nuevo.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setPhase('setup')}>
            Volver a intentar
          </button>
        </div>
      )}

      {phase === 'champion' && (
        <div className="glass-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', maxWidth: '600px', margin: '0 auto', border: '2px solid var(--neon-gold)', boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-md)' }}><Crown size={80} color="var(--neon-gold)" /></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 'var(--space-md)', color: 'var(--neon-gold)' }}>
            ¡CAMPEONES DEL MUNDO!
          </h3>
          <p style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
            Has derrotado a todas las selecciones y te coronas en la cima del fútbol.
          </p>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--neon-gold)', marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            Premio Especial: <Coins size={18} /> +2500 MC
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setPhase('setup')}>
            Jugar otra vez
          </button>
        </div>
      )}
    </div>
  );
}
