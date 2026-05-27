import type { Player } from '../types';
import { Zap, Coins, Dumbbell, Shield, Sword, Star } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onRecruit?: (player: Player) => void;
  onSelect?: (player: Player) => void;
  onTrain?: (player: Player) => void;
  showActions?: boolean;
  isOwned?: boolean;
  compact?: boolean;
  onSell?: (player: Player) => void;
  sellValue?: number;
}

function calculateOverall(stats: Player['stats']): number {
  const { pace, shooting, passing, dribbling, defense, physical } = stats;
  return Math.round((pace + shooting + passing + dribbling + defense + physical) / 6);
}

function getStatClass(value: number): string {
  if (value >= 80) return 'stat-high';
  if (value >= 60) return 'stat-mid';
  return 'stat-low';
}

export default function PlayerCard({ player, onRecruit, onSelect, onTrain, onSell, sellValue, showActions = true, isOwned = false, compact = false }: PlayerCardProps) {
  const overall = player.overall || calculateOverall(player.stats);

  const cardBg = {
    common: 'var(--gradient-card-common)',
    rare: 'var(--gradient-card-rare)',
    epic: 'var(--gradient-card-epic)',
    legendary: 'var(--gradient-card-legendary)',
  }[player.rarity];

  return (
    <div
      className={`player-card rarity-${player.rarity} ${compact ? 'compact' : ''}`}
      style={{ background: cardBg }}
      onClick={() => onSelect?.(player)}
    >
      <div className="card-inner">
        <div className="card-header">
          <div>
            <div className="card-overall" style={{ color: `var(--rarity-${player.rarity})` }}>
              {overall}
            </div>
            <div className="card-position">{player.position}</div>
            {player.level > 1 && (
              <div className="card-level" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={10} fill="currentColor" /> LVL {player.level}</div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="card-stat-label" style={{ fontSize: '0.6rem' }}>{player.rarity.toUpperCase()}</div>
          </div>
        </div>

        <div className="card-image-container">
          {player.image && player.image !== 'placeholder' ? (
            <img src={player.image} alt={player.name} loading="lazy" />
          ) : (
            <div className="card-image-placeholder">
              {player.type === 'anime' ? <Sword size={64} opacity={0.5} /> : <Shield size={64} opacity={0.5} />}
            </div>
          )}
          <span className={`card-type-badge ${player.type}`}>
            {player.type === 'anime' ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Sword size={12} /> ANIME</span> : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={12} /> REAL</span>}
          </span>
        </div>

        <div className="card-name" title={player.name}>{player.name}</div>
        <div className="card-subtitle">{player.source}</div>

        {!compact && (
          <>
            <div className="card-stats">
              <div className="card-stat">
                <span className="card-stat-label">PAC</span>
                <span className={`card-stat-value ${getStatClass(player.stats.pace)}`}>
                  {player.stats.pace}
                </span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">SHO</span>
                <span className={`card-stat-value ${getStatClass(player.stats.shooting)}`}>
                  {player.stats.shooting}
                </span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">PAS</span>
                <span className={`card-stat-value ${getStatClass(player.stats.passing)}`}>
                  {player.stats.passing}
                </span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">DRI</span>
                <span className={`card-stat-value ${getStatClass(player.stats.dribbling)}`}>
                  {player.stats.dribbling}
                </span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">DEF</span>
                <span className={`card-stat-value ${getStatClass(player.stats.defense)}`}>
                  {player.stats.defense}
                </span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">PHY</span>
                <span className={`card-stat-value ${getStatClass(player.stats.physical)}`}>
                  {player.stats.physical}
                </span>
              </div>
            </div>

            <div className="card-special" title={player.specialAbility.description}>
              <div className="card-special-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={14} color="var(--neon-pink)" /> {player.specialAbility.name}
              </div>
              <div className="card-special-power">PWR {player.specialAbility.power}</div>
            </div>
          </>
        )}

        {showActions && (
          <div className="card-actions">
            {!isOwned && onRecruit && (
              <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onRecruit(player); }}>
                <Coins size={16} /> Reclutar
              </button>
            )}
            {isOwned && onTrain && (
              <button className="btn btn-primary btn-sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={(e) => {
                e.stopPropagation();
                onTrain(player);
              }}>
                <Dumbbell size={16} /> Entrenar
              </button>
            )}
            {isOwned && onSell && sellValue !== undefined && (
              <button className="btn btn-secondary btn-sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={(e) => {
                e.stopPropagation();
                onSell(player);
              }}>
                <Coins size={16} /> Vender ({sellValue} MC)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
