import { useState, useEffect, useRef } from 'react';
import type { MatchResult, MatchEvent, Player } from '../types';
import { simulateMatch } from '../api';
import { 
  MonitorPlay, Goal, ShieldAlert, Zap, HeartPulse, RefreshCcw, 
  Flag, Dices, Play, Coins, Pause, Trophy, Wind, Home
} from 'lucide-react';
import { NATIONAL_TEAMS, CLUB_TEAMS } from '../data/teams';

interface MatchSimulatorProps {
  homeTeam: Player[];
  onMatchEnd?: (reward: number, result: MatchResult) => void;
  overrideBotTeam?: { name: string; players: Player[] };
}

// Generate a bot team using the predefined clubs and national teams (with real player names)
function generateBotTeam(): { name: string; players: Player[] } {
  const allTeams = [...NATIONAL_TEAMS, ...CLUB_TEAMS];
  const team = allTeams[Math.floor(Math.random() * allTeams.length)];
  return { name: team.name, players: team.players };
}

function getEventIcon(type: string): React.ReactNode {
  switch (type) {
    case 'goal': return <Goal size={16} color="var(--neon-green)" />;
    case 'save': return <ShieldAlert size={16} color="var(--neon-blue)" />;
    case 'foul': return <div style={{ width: 12, height: 16, background: 'var(--neon-gold)', borderRadius: 2 }} />;
    case 'special_ability_triggered': return <Zap size={16} color="var(--neon-pink)" />;
    case 'injury': return <HeartPulse size={16} color="var(--danger)" />;
    case 'substitution_forced': return <RefreshCcw size={16} color="var(--text-muted)" />;
    case 'start': return <Flag size={16} />;
    case 'half_time': return <Pause size={16} />;
    case 'full_time': return <Trophy size={16} color="var(--neon-gold)" />;
    case 'chance': return <Wind size={16} color="var(--text-muted)" />;
    case 'possession': return <RefreshCcw size={16} color="var(--text-muted)" />;
    default: return <MonitorPlay size={16} />;
  }
}

function LineupDisplay({ title, players, isHome }: { title: string; players: Player[]; isHome: boolean }) {
  return (
    <div className="glass-card" style={{ padding: 'var(--space-md)', flex: 1, minWidth: '280px' }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        marginBottom: 'var(--space-md)',
        borderBottom: `2px solid ${isHome ? 'var(--neon-blue)' : 'var(--neon-pink)'}`,
        paddingBottom: 'var(--space-xs)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{title}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--neon-gold)' }}>
          OVR: {Math.round(players.reduce((acc, p) => acc + Math.round((p.stats.pace + p.stats.shooting + p.stats.passing + p.stats.dribbling + p.stats.defense + p.stats.physical) / 6), 0) / (players.length || 1))}
        </span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {players.map((player) => {
          const ovr = Math.round((player.stats.pace + player.stats.shooting + player.stats.passing + player.stats.dribbling + player.stats.defense + player.stats.physical) / 6);
          const typeBadgeText = player.type === 'anime' ? '🎌' : '⚽';
          
          return (
            <div key={player.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px var(--space-sm)',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${player.type === 'anime' ? 'var(--neon-pink)' : 'var(--neon-green)'}`,
              gap: 'var(--space-sm)'
            }}>
              {/* Position badge */}
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.1)',
                minWidth: '38px',
                textAlign: 'center',
                fontFamily: 'var(--font-display)'
              }}>
                {player.position}
              </div>

              {/* Avatar circular glow */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `1.5px solid ${player.type === 'anime' ? 'var(--neon-pink)' : 'var(--neon-green)'}`,
                boxShadow: `0 0 6px ${player.type === 'anime' ? 'var(--neon-pink-glow)' : 'var(--neon-green-glow)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-deep)'
              }}>
                {player.image && player.image !== 'placeholder' ? (
                  <img src={player.image} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '0.75rem' }}>{typeBadgeText}</span>
                )}
              </div>

              {/* Player details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {player.name}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>Lv.{player.level}</span>
                  {player.specialAbility?.name && (
                    <span style={{ color: 'var(--neon-pink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }} title={player.specialAbility.description}>
                      ⚡ {player.specialAbility.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Player OVR */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 800,
                color: ovr >= 85 ? 'var(--neon-gold)' : ovr >= 75 ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}>
                {ovr}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MatchSimulator(props: MatchSimulatorProps) {
  const { homeTeam } = props;
  const [phase, setPhase] = useState<'pre' | 'playing' | 'finished'>('pre');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [displayedEvents, setDisplayedEvents] = useState<MatchEvent[]>([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [botTeam, setBotTeam] = useState<{name: string; players: Player[]}>(() => props.overrideBotTeam || generateBotTeam());

  useEffect(() => {
    if (props.overrideBotTeam) {
      setBotTeam(props.overrideBotTeam);
    }
  }, [props.overrideBotTeam]);
  const [goalFlash, setGoalFlash] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [reward, setReward] = useState(0);
  const eventLogRef = useRef<HTMLDivElement>(null);

  const startMatch = async () => {
    setSimulating(true);
    setPhase('playing');
    setDisplayedEvents([]);
    setCurrentMinute(0);
    setResult(null);

    try {
      const matchResult = await simulateMatch(homeTeam, botTeam.players);
      setResult(matchResult);
      // Start playing events one by one
      playEvents(matchResult.events, matchResult);
    } catch {
      console.error('Match simulation failed');
      setPhase('pre');
    } finally {
      setSimulating(false);
    }
  };

  const playEvents = (events: MatchEvent[], matchResult: MatchResult) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= events.length) {
        clearInterval(interval);
        setPhase('finished');
        
        // Calculate reward
        let calculatedReward = 0;
        if (matchResult.score.home > matchResult.score.away) calculatedReward += 200; // Win
        else if (matchResult.score.home === matchResult.score.away) calculatedReward += 100; // Draw
        else calculatedReward += 50; // Loss
        calculatedReward += matchResult.score.home * 10; // +10 per goal

        setReward(calculatedReward);
        if (props.onMatchEnd) props.onMatchEnd(calculatedReward, matchResult);
        
        return;
      }
      const event = events[index];
      setCurrentMinute(event.minute);
      setDisplayedEvents(prev => [...prev, event]);

      if (event.type === 'goal') {
        setGoalFlash(true);
        setTimeout(() => setGoalFlash(false), 1000);
      }

      index++;
    }, 600); // Show a new event every 600ms
  };

  useEffect(() => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
    }
  }, [displayedEvents]);

  const reroll = () => {
    setBotTeam(generateBotTeam());
  };

  // Calculate live score from displayed events
  const liveScore = { home: 0, away: 0 };
  displayedEvents.forEach(e => {
    if (e.type === 'goal') {
      if (e.team === 'home') liveScore.home++;
      else liveScore.away++;
    }
  });

  if (homeTeam.length < 5) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon"><MonitorPlay size={48} /></div>
          <div className="empty-state-text">
            Necesitas al menos 5 jugadores en tu equipo para simular un partido.
            <br />Ve a la pestaña "Mi Equipo" y coloca 5 jugadores en el campo.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-container match-arena ${goalFlash ? 'goal-celebration' : ''}`}>
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MonitorPlay className="text-neon-blue" /> Simulador del <span className="highlight">Mundial</span>
      </h2>

      {/* Pre-match: choose rival */}
      {phase === 'pre' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="glass-card" style={{ display: 'inline-block', padding: 'var(--space-xl)', width: '100%', maxWidth: '650px' }}>
              <h3 style={{ marginBottom: 'var(--space-md)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Previa del Encuentro</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xl)', margin: 'var(--space-lg) 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--neon-blue), #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tu Equipo</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OVR {Math.round(homeTeam.reduce((acc, p) => acc + Math.round((p.stats.pace + p.stats.shooting + p.stats.passing + p.stats.dribbling + p.stats.defense + p.stats.physical) / 6), 0) / (homeTeam.length || 1))}</div>
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>VS</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--neon-pink), #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{botTeam.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OVR {Math.round(botTeam.players.reduce((acc, p) => acc + Math.round((p.stats.pace + p.stats.shooting + p.stats.passing + p.stats.dribbling + p.stats.defense + p.stats.physical) / 6), 0) / (botTeam.players.length || 1))}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
                {!props.overrideBotTeam && (
                  <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={reroll}>
                    <Dices size={18} /> Otro rival
                  </button>
                )}
                <button className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={startMatch} disabled={simulating}>
                  {simulating ? <RefreshCcw size={20} className="spin" /> : <Play size={20} />} 
                  {simulating ? 'Simulando...' : '¡Jugar Partido!'}
                </button>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-md)'
          }}>
            <LineupDisplay title="Tu Alineación" players={homeTeam} isHome={true} />
            <LineupDisplay title={`Alineación de ${botTeam.name}`} players={botTeam.players} isHome={false} />
          </div>
        </div>
      )}

      {/* During match or post-match: show scoreboard + events */}
      {(phase === 'playing' || phase === 'finished') && (
        <>
          {/* Scoreboard */}
          <div className="scoreboard">
            <div className="scoreboard-team">
              <div className="scoreboard-team-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <Home size={18} /> Tu Equipo
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
              <div className="scoreboard-score">{phase === 'finished' && result ? result.score.home : liveScore.home}</div>
              <div style={{ textAlign: 'center' }}>
                <div className="scoreboard-vs">VS</div>
                {phase === 'playing' && (
                  <div className="scoreboard-minute">{currentMinute}'</div>
                )}
                {phase === 'finished' && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--neon-green)', fontWeight: 700 }}>FINAL</div>
                )}
              </div>
              <div className="scoreboard-score">{phase === 'finished' && result ? result.score.away : liveScore.away}</div>
            </div>
            <div className="scoreboard-team">
              <div className="scoreboard-team-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                {botTeam.name}
              </div>
            </div>
          </div>

          {/* Grid Layout: Live Commentary/Stats on Left, Lineups on Right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-lg)',
            alignItems: 'start'
          }}>
            {/* Left Column: Match narrative + Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <MonitorPlay size={16} /> Narración del Partido
              </h3>
              
              {/* Event Log */}
              <div className="event-log" ref={eventLogRef} style={{ height: '350px' }}>
                {displayedEvents.length === 0 && phase === 'playing' && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
                    <div className="spinner" />
                    <div>Preparando el partido...</div>
                  </div>
                )}
                {displayedEvents.map((event, idx) => (
                  <div key={idx} className={`event-item ${event.type}`}>
                    <div className="event-minute">{event.minute}'</div>
                    <div className="event-icon">{getEventIcon(event.type)}</div>
                    <div className="event-description" dangerouslySetInnerHTML={{
                      __html: event.description.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong>$1</strong>'
                      )
                    }} />
                  </div>
                ))}
              </div>

              {/* Post-match stats */}
              {phase === 'finished' && result && (
                <>
                  {/* Match Stats */}
                  <div className="match-stats" style={{ marginTop: 0 }}>
                    <div className="match-stat-row">
                      <div className="match-stat-home">{result.stats.home.possession}%</div>
                      <div className="match-stat-label">Posesión</div>
                      <div className="match-stat-away">{result.stats.away.possession}%</div>
                    </div>
                    <div className="match-stat-row">
                      <div className="match-stat-home">{result.stats.home.shots}</div>
                      <div className="match-stat-label">Tiros</div>
                      <div className="match-stat-away">{result.stats.away.shots}</div>
                    </div>
                    <div className="match-stat-row">
                      <div className="match-stat-home">{result.stats.home.shotsOnTarget}</div>
                      <div className="match-stat-label">A Puerta</div>
                      <div className="match-stat-away">{result.stats.away.shotsOnTarget}</div>
                    </div>
                    <div className="match-stat-row">
                      <div className="match-stat-home">{result.stats.home.fouls}</div>
                      <div className="match-stat-label">Faltas</div>
                      <div className="match-stat-away">{result.stats.away.fouls}</div>
                    </div>
                    <div className="match-stat-row">
                      <div className="match-stat-home">{result.stats.home.specialAbilities}</div>
                      <div className="match-stat-label">Hab. Especiales</div>
                      <div className="match-stat-away">{result.stats.away.specialAbilities}</div>
                    </div>
                  </div>

                  {/* Player of the Match */}
                  {result.playerOfTheMatch && (
                    <div className="potm-banner">
                      <div>
                        <div className="potm-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Trophy size={16} color="var(--bg-deepest)" /> Jugador del Partido
                        </div>
                        <div className="potm-name">{result.playerOfTheMatch.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {result.playerOfTheMatch.source}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Match Rewards */}
                  <div style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        Recompensa: <Coins size={16} /> +{reward} MC
                      </div>
                  </div>

                  {/* Play again */}
                  <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
                    <button className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }} onClick={() => { setPhase('pre'); setDisplayedEvents([]); reroll(); }}>
                      <RefreshCcw size={20} /> Jugar Otro Partido
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Starting Lineups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
                📋 Alineaciones
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <LineupDisplay title="Tu Equipo" players={homeTeam} isHome={true} />
                <LineupDisplay title={botTeam.name} players={botTeam.players} isHome={false} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
