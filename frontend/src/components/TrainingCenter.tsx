import { useState, useEffect, useCallback } from 'react';
import type { Player, TrainingDrill } from '../types';
import { fetchDrills, trainPlayer } from '../api';
import PlayerCard from './PlayerCard';
import { Dumbbell, Clock, Coins, Zap, Search, ArrowLeft } from 'lucide-react';

interface TrainingCenterProps {
  ownedPlayers: Player[];
  coins: number;
  onCoinsSpent: (amount: number) => void;
  onPlayerUpdated: (updatedPlayer: Player) => void;
}

export default function TrainingCenter({ ownedPlayers, coins, onCoinsSpent, onPlayerUpdated }: TrainingCenterProps) {
  const [drills, setDrills] = useState<TrainingDrill[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [training, setTraining] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loadingDrills, setLoadingDrills] = useState(true);
  const [animatingPlayerId, setAnimatingPlayerId] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<'training' | 'levelup' | null>(null);

  useEffect(() => {
    fetchDrills()
      .then(setDrills)
      .catch(console.error)
      .finally(() => setLoadingDrills(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleTrain = useCallback(async (drill: TrainingDrill) => {
    if (!selectedPlayer) return;
    if (coins < drill.cost) {
      setToast({ message: '[MC] No tienes suficientes MangaCoins', type: 'error' });
      return;
    }
    setTraining(true);
    try {
      const result = await trainPlayer(selectedPlayer.id, drill.id);
      onPlayerUpdated(result.player);
      onCoinsSpent(drill.cost);
      setSelectedPlayer(result.player);

      let msg = `${selectedPlayer.name}: +${drill.statBoost.amount} ${drill.statBoost.stat.toUpperCase()}, +${drill.xpReward} XP`;
      if (result.leveledUp) {
        msg += ` (¡LEVEL UP! → Nivel ${result.player.level})`;
        setAnimationType('levelup');
      } else {
        setAnimationType('training');
      }
      setAnimatingPlayerId(selectedPlayer.id);
      
      // Clear animation after it finishes (matches CSS duration)
      setTimeout(() => {
        setAnimatingPlayerId(null);
        setAnimationType(null);
      }, result.leveledUp ? 1200 : 600);

      setToast({ message: msg, type: 'success' });
    } catch {
      setToast({ message: 'Error al entrenar', type: 'error' });
    } finally {
      setTraining(false);
    }
  }, [selectedPlayer, coins, onPlayerUpdated, onCoinsSpent]);

  const xpForNextLevel = selectedPlayer ? selectedPlayer.level * 100 : 100;
  const xpProgress = selectedPlayer ? (selectedPlayer.xp / xpForNextLevel) * 100 : 0;

  return (
    <div className="page-container">
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Dumbbell className="text-neon-gold" /> Centro de <span className="highlight">Entrenamiento</span>
      </h2>

      {ownedPlayers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Search size={48} /></div>
          <div className="empty-state-text">
            No tienes jugadores. ¡Ve al Mercado de Fichajes para reclutar!
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
          {/* Player Selection */}
          <div style={{ flex: '1 1 320px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)', fontSize: '1.1rem' }}>
              Selecciona un jugador
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              {ownedPlayers.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlayer(p)}
                  className={animatingPlayerId === p.id ? (animationType === 'levelup' ? 'level-up-anim' : 'training-anim') : ''}
                  style={{
                    cursor: 'pointer',
                    border: selectedPlayer?.id === p.id ? '2px solid var(--neon-green)' : '2px solid transparent',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'border var(--transition-base), box-shadow var(--transition-base)',
                    boxShadow: selectedPlayer?.id === p.id ? '0 0 20px var(--neon-green-glow)' : 'none',
                  }}
                >
                  <PlayerCard player={p} showActions={false} compact={true} isOwned={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Training Panel */}
          <div style={{ flex: '1 1 400px' }}>
            {selectedPlayer ? (
              <>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                      {selectedPlayer.name}
                    </h3>
                    <span style={{
                      color: 'var(--neon-gold)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem'
                    }}>
                      Nivel {selectedPlayer.level}
                    </span>
                  </div>

                  {/* XP Bar */}
                  <div className="xp-bar-container">
                    <div className="xp-bar" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
                  </div>
                  <div className="xp-label">
                    {selectedPlayer.xp} / {xpForNextLevel} XP
                  </div>

                  {/* Current Stats */}
                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Estadísticas actuales
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)' }}>
                      {Object.entries(selectedPlayer.stats).map(([stat, val]) => (
                        <div key={stat} style={{
                          padding: 'var(--space-xs) var(--space-sm)',
                          background: 'var(--bg-deep)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                        }}>
                          <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.substring(0, 3)}</span>
                          <span style={{
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)',
                            color: (val as number) >= 80 ? 'var(--neon-green)' : (val as number) >= 60 ? 'var(--neon-gold)' : 'var(--danger)',
                          }}>{val as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Training Drills */}
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={18} color="var(--neon-gold)" /> Ejercicios Disponibles
                </h3>

                {loadingDrills ? (
                  <div className="spinner" />
                ) : (
                  <div className="training-grid" style={{ padding: 0 }}>
                    {drills.map(drill => {
                      const canAfford = coins >= drill.cost;
                      return (
                        <div key={drill.id} className="drill-card">
                          <div className="drill-name">{drill.name}</div>
                          <div className="drill-description">{drill.description}</div>
                          <div className="drill-meta">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={14} /> {drill.duration} min
                            </span>
                            <span style={{ color: canAfford ? 'var(--neon-gold)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Coins size={14} /> {drill.cost} MC
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                            <div className="drill-boost">
                              +{drill.statBoost.amount} {drill.statBoost.stat.toUpperCase()}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--neon-blue)' }}>+{drill.xpReward} XP</span>
                          </div>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                            onClick={() => handleTrain(drill)}
                            disabled={training || !canAfford}
                          >
                            {training ? <Clock size={16} className="spin" /> : <Dumbbell size={16} />} 
                            {training ? 'Entrenando...' : 'Entrenar'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
                <div className="empty-state-icon"><ArrowLeft size={48} /></div>
                <div className="empty-state-text">Selecciona un jugador para entrenar</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
