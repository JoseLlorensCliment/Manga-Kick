import { useState, useEffect, useCallback } from 'react';
import type { Player, LineupSlot } from './types';
import { fetchAllPlayers } from './api';
import { Shirt, Handshake, Dumbbell, Swords, Trophy, Activity, Coins, Users } from 'lucide-react';
import DraftMarket from './components/DraftMarket';
import PlayerCard from './components/PlayerCard';
import TacticalPitch, { getFormationSlots } from './components/TacticalPitch';
import MatchSimulator from './components/MatchSimulator';
import TrainingCenter from './components/TrainingCenter';
import Tournaments from './components/Tournaments';
import './index.css';

const RARITY_COST: Record<string, number> = {
  common: 100,
  rare: 250,
  epic: 500,
  legendary: 1000,
};

const FORMATIONS = ['1-2-2', '1-1-2-1', '1-2-1-1', '1-1-1-2'];

function App() {
  const [tab, setTab] = useState<'team' | 'market' | 'training' | 'match' | 'tournaments'>('team');
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [ownedPlayers, setOwnedPlayers] = useState<Player[]>([]);
  const [coins, setCoins] = useState(3000);
  const [loading, setLoading] = useState(true);
  const [formation, setFormation] = useState('1-2-2');
  const [lineup, setLineup] = useState<LineupSlot[]>(getFormationSlots('1-2-2'));
  const [assigningSlot, setAssigningSlot] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load all players from backend
  useEffect(() => {
    fetchAllPlayers()
      .then(players => setAllPlayers(players))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const ownedPlayerIds = new Set(ownedPlayers.map(p => p.id));

  // Recruit a player
  const handleRecruit = useCallback((player: Player) => {
    const cost = RARITY_COST[player.rarity] || 100;
    if (coins < cost) {
      setToast({ message: 'No tienes suficientes MangaCoins', type: 'error' });
      return;
    }
    if (ownedPlayerIds.has(player.id)) {
      setToast({ message: 'Ya tienes este jugador', type: 'error' });
      return;
    }
    setOwnedPlayers(prev => [...prev, player]);
    setCoins(prev => prev - cost);
    setToast({ message: `¡${player.name} fichado por ${cost} MC!`, type: 'success' });
  }, [coins, ownedPlayerIds]);

  // Change formation
  const handleFormationChange = useCallback((newFormation: string) => {
    setFormation(newFormation);
    const newSlots = getFormationSlots(newFormation);
    // Try to preserve assigned players
    const currentPlayers = lineup.filter(s => s.player !== null).map(s => s.player!);
    currentPlayers.forEach((p, i) => {
      if (i < newSlots.length) {
        newSlots[i].player = p;
      }
    });
    setLineup(newSlots);
  }, [lineup]);

  // Pitch slot clicked
  const handleSlotClick = useCallback((slotIndex: number) => {
    const slot = lineup[slotIndex];
    if (slot.player) {
      // Remove player from slot
      setLineup(prev => {
        const updated = [...prev];
        updated[slotIndex] = { ...updated[slotIndex], player: null };
        return updated;
      });
    } else {
      // Open assignment modal
      setAssigningSlot(slotIndex);
    }
  }, [lineup]);

  // Assign player to slot
  const handleAssignPlayer = useCallback((player: Player) => {
    if (assigningSlot === null) return;
    // Check if player already in lineup
    const alreadyInLineup = lineup.some(s => s.player?.id === player.id);
    if (alreadyInLineup) {
      setToast({ message: '⚠️ Este jugador ya está en el campo', type: 'error' });
      return;
    }
    setLineup(prev => {
      const updated = [...prev];
      updated[assigningSlot] = { ...updated[assigningSlot], player };
      return updated;
    });
    setAssigningSlot(null);
  }, [assigningSlot, lineup]);

  // Sell a player
  const handleSellPlayer = useCallback((player: Player) => {
    const baseCost = RARITY_COST[player.rarity] || 100;
    const sellValue = Math.floor(baseCost * (1 + (player.level - 1) * 0.5));
    
    // Remove from lineup
    setLineup(prev => prev.map(s => s.player?.id === player.id ? { ...s, player: null } : s));
    
    // Remove from owned
    setOwnedPlayers(prev => prev.filter(p => p.id !== player.id));
    
    // Add coins
    setCoins(prev => prev + sellValue);
    setToast({ message: `Vendiste a ${player.name} por ${sellValue} MC`, type: 'success' });
  }, []);

  const getSellValue = (player: Player) => {
    const baseCost = RARITY_COST[player.rarity] || 100;
    return Math.floor(baseCost * (1 + (player.level - 1) * 0.5));
  };

  // Player updated from training
  const handlePlayerUpdated = useCallback((updatedPlayer: Player) => {
    setOwnedPlayers(prev =>
      prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
    );
    // Also update in lineup if present
    setLineup(prev =>
      prev.map(s => s.player?.id === updatedPlayer.id ? { ...s, player: updatedPlayer } : s)
    );
  }, []);

  // Get the lineup players for the match
  const lineupPlayers = lineup.filter(s => s.player !== null).map(s => s.player!);

  return (
    <>
      <div className="app-background" />

      {/* Header */}
      <header className="app-header">
        <div className="app-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Manga<span>Kick</span> <Activity size={24} color="var(--neon-green)" />
        </div>

        <nav className="nav-tabs">
          <button className={`nav-tab ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')}>
            <span className="nav-tab-icon"><Shirt size={20} /></span>
            <span className="nav-tab-label">Mi Equipo</span>
          </button>
          <button className={`nav-tab ${tab === 'market' ? 'active' : ''}`} onClick={() => setTab('market')}>
            <span className="nav-tab-icon"><Handshake size={20} /></span>
            <span className="nav-tab-label">Mercado</span>
          </button>
          <button className={`nav-tab ${tab === 'training' ? 'active' : ''}`} onClick={() => setTab('training')}>
            <span className="nav-tab-icon"><Dumbbell size={20} /></span>
            <span className="nav-tab-label">Entrenar</span>
          </button>
          <button className={`nav-tab ${tab === 'match' ? 'active' : ''}`} onClick={() => setTab('match')}>
            <span className="nav-tab-icon"><Swords size={20} /></span>
            <span className="nav-tab-label">Amistoso</span>
          </button>
          <button className={`nav-tab ${tab === 'tournaments' ? 'active' : ''}`} onClick={() => setTab('tournaments')}>
            <span className="nav-tab-icon"><Trophy size={20} /></span>
            <span className="nav-tab-label">Torneos</span>
          </button>
        </nav>

        <div className="wallet-display">
          <span className="wallet-icon"><Coins size={20} className="text-neon-gold" /></span>
          <span className="wallet-amount">{coins.toLocaleString()} MC</span>
        </div>
      </header>

      {/* Content */}
      <main>
        {/* Market Tab */}
        {tab === 'market' && (
          <DraftMarket
            availablePlayers={allPlayers}
            ownedPlayerIds={ownedPlayerIds}
            coins={coins}
            onRecruit={handleRecruit}
            loading={loading}
          />
        )}

        {/* Team Tab */}
        {tab === 'team' && (
          <div className="page-container">
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users className="text-neon-blue" /> Mi <span className="highlight">Equipo</span>
            </h2>

            {/* Formation selector */}
            <div className="filter-chips" style={{ marginBottom: 'var(--space-xl)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center', marginRight: '8px' }}>
                Formación:
              </span>
              {FORMATIONS.map(f => (
                <button
                  key={f}
                  className={`filter-chip ${formation === f ? 'active' : ''}`}
                  onClick={() => handleFormationChange(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Tactical Pitch */}
            <TacticalPitch
              lineup={lineup}
              onSlotClick={handleSlotClick}
              formation={formation}
            />

            {/* Owned players list */}
            {ownedPlayers.length > 0 && (
              <div style={{ marginTop: 'var(--space-2xl)' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--text-secondary)',
                }}>
                  🎯 Plantilla ({ownedPlayers.length} jugadores)
                </h3>
                <div className="player-grid" style={{ justifyContent: 'flex-start' }}>
                  {ownedPlayers.map(p => {
                    const inLineup = lineup.some(s => s.player?.id === p.id);
                    return (
                      <div key={p.id} style={{
                        opacity: inLineup ? 0.5 : 1,
                        position: 'relative',
                      }}>
                        <PlayerCard
                          player={p}
                          showActions={true}
                          isOwned={true}
                          onSelect={() => setTab('training')}
                          onTrain={() => setTab('training')}
                          onSell={handleSellPlayer}
                          sellValue={getSellValue(p)}
                        />
                        {inLineup && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.7)',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--neon-green)',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}>
                            EN CAMPO ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {ownedPlayers.length === 0 && (
              <div className="empty-state" style={{ marginTop: 'var(--space-2xl)' }}>
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-text">
                  Tu plantilla está vacía. ¡Ve al Mercado de Fichajes para reclutar jugadores!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Training Tab */}
        {tab === 'training' && (
          <TrainingCenter
            ownedPlayers={ownedPlayers}
            coins={coins}
            onCoinsSpent={(amount) => setCoins(prev => prev - amount)}
            onPlayerUpdated={handlePlayerUpdated}
          />
        )}

        {/* Match Tab */}
        {tab === 'match' && (
          <MatchSimulator 
            homeTeam={lineupPlayers} 
            onMatchEnd={(reward) => {
              setCoins(prev => prev + reward);
              setToast({ message: `Ganaste ${reward} MC por el amistoso`, type: 'success' });
            }}
          />
        )}

        {/* Tournaments Tab */}
        {tab === 'tournaments' && (
          <Tournaments 
            playerTeam={lineupPlayers} 
            onReward={(reward) => {
              setCoins(prev => prev + reward);
              setToast({ message: `Premio de torneo: +${reward} MC`, type: 'success' });
            }} 
          />
        )}
      </main>

      {/* Assignment Modal */}
      {assigningSlot !== null && (
        <div className="modal-overlay" onClick={() => setAssigningSlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>
              Asignar jugador a {lineup[assigningSlot].position}
            </h3>
            {ownedPlayers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No tienes jugadores. ¡Ve al Mercado!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxHeight: '50vh', overflowY: 'auto' }}>
                {ownedPlayers
                  .filter(p => !lineup.some(s => s.player?.id === p.id))
                  .map(p => (
                    <button
                      key={p.id}
                      className="btn btn-secondary"
                      style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                      onClick={() => handleAssignPlayer(p)}
                    >
                      <span style={{ marginRight: '8px' }}>{p.type === 'anime' ? '🎌' : '⚽'}</span>
                      <span style={{ fontWeight: 700 }}>{p.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.position} • OVR {Math.round((p.stats.pace + p.stats.shooting + p.stats.passing + p.stats.dribbling + p.stats.defense + p.stats.physical) / 6)}
                      </span>
                    </button>
                  ))
                }
                {ownedPlayers.filter(p => !lineup.some(s => s.player?.id === p.id)).length === 0 && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                    Todos tus jugadores ya están en el campo.
                  </p>
                )}
              </div>
            )}
            <button className="btn btn-secondary" style={{ marginTop: 'var(--space-md)', width: '100%' }} onClick={() => setAssigningSlot(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

export default App;
