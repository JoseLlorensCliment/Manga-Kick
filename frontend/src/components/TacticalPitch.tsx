import type { LineupSlot } from '../types';
import { Sword, Shield, Star } from 'lucide-react';

interface TacticalPitchProps {
  lineup: LineupSlot[];
  onSlotClick: (slotIndex: number) => void;
  formation: string;
}

function calculateTeamOverall(lineup: LineupSlot[]): number {
  const players = lineup.filter(s => s.player !== null).map(s => s.player!);
  if (players.length === 0) return 0;
  const total = players.reduce((sum, p) => {
    const { pace, shooting, passing, dribbling, defense, physical } = p.stats;
    return sum + Math.round((pace + shooting + passing + dribbling + defense + physical) / 6);
  }, 0);
  return Math.round(total / players.length);
}

export default function TacticalPitch({ lineup, onSlotClick, formation }: TacticalPitchProps) {
  const teamOverall = calculateTeamOverall(lineup);
  const filledCount = lineup.filter(s => s.player !== null).length;

  return (
    <div style={{ position: 'relative' }}>
      <div className="pitch-container">
        {/* Pitch markings */}
        <div className="pitch-center-dot" />
        <div className="pitch-goal-area-top" />
        <div className="pitch-goal-area-bottom" />

        {/* Player Slots */}
        {lineup.map((slot, idx) => (
          <div
            key={idx}
            className={`pitch-slot ${slot.player ? '' : 'pitch-slot-empty'}`}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            onClick={() => onSlotClick(idx)}
            title={slot.player ? `${slot.player.name} (${slot.position})` : `Vacante: ${slot.position}`}
          >
            <div className="pitch-slot-avatar" style={
              slot.player ? {
                borderColor: slot.player.type === 'anime' ? 'var(--neon-pink)' : 'var(--neon-green)',
                boxShadow: `0 0 12px ${slot.player.type === 'anime' ? 'var(--neon-pink-glow)' : 'var(--neon-green-glow)'}`,
              } : {}
            }>
              {slot.player ? (
                slot.player.image && slot.player.image !== 'placeholder' ? (
                  <img src={slot.player.image} alt={slot.player.name} />
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {slot.player.type === 'anime' ? <Sword size={12} /> : <Shield size={12} />}
                  </span>
                )
              ) : (
                <span style={{ fontSize: '1.2rem', opacity: 0.4 }}>+</span>
              )}
            </div>
            <div className="pitch-slot-name">
              {slot.player ? slot.player.name.split(' ').pop() : '—'}
            </div>
            <div className="pitch-slot-pos">{slot.position}</div>
          </div>
        ))}

        {/* Formation label */}
        <div className="pitch-formation-label">{formation}</div>

        {/* Team overall */}
        <div className="pitch-overall-rating">
          <div style={{ padding: '8px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', border: '1px solid var(--neon-gold)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} color="var(--neon-gold)" /> {teamOverall} OVR
          </div>
        </div>
      </div>

      {/* Team info bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--space-md)',
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.85rem',
      }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          Jugadores: <strong style={{ color: filledCount === 5 ? 'var(--neon-green)' : 'var(--neon-gold)' }}>{filledCount}/5</strong>
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Formación: <strong style={{ color: 'var(--text-primary)' }}>{formation}</strong>
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          OVR: <strong style={{ color: teamOverall >= 80 ? 'var(--neon-green)' : teamOverall >= 60 ? 'var(--neon-gold)' : 'var(--danger)' }}>{teamOverall}</strong>
        </span>
      </div>
    </div>
  );
}

// Helper: generate formation slot positions
export function getFormationSlots(formation: string): LineupSlot[] {
  switch (formation) {
    case '1-2-2':
      return [
        { position: 'GK', player: null, x: 50, y: 88 },
        { position: 'DEF', player: null, x: 30, y: 65 },
        { position: 'DEF', player: null, x: 70, y: 65 },
        { position: 'FWD', player: null, x: 30, y: 25 },
        { position: 'FWD', player: null, x: 70, y: 25 },
      ];
    case '1-1-2-1':
      return [
        { position: 'GK', player: null, x: 50, y: 88 },
        { position: 'DEF', player: null, x: 50, y: 68 },
        { position: 'MID', player: null, x: 30, y: 45 },
        { position: 'MID', player: null, x: 70, y: 45 },
        { position: 'FWD', player: null, x: 50, y: 18 },
      ];
    case '1-2-1-1':
      return [
        { position: 'GK', player: null, x: 50, y: 88 },
        { position: 'DEF', player: null, x: 30, y: 68 },
        { position: 'DEF', player: null, x: 70, y: 68 },
        { position: 'MID', player: null, x: 50, y: 45 },
        { position: 'FWD', player: null, x: 50, y: 18 },
      ];
    case '1-1-1-2':
      return [
        { position: 'GK', player: null, x: 50, y: 88 },
        { position: 'DEF', player: null, x: 50, y: 68 },
        { position: 'MID', player: null, x: 50, y: 45 },
        { position: 'FWD', player: null, x: 35, y: 20 },
        { position: 'FWD', player: null, x: 65, y: 20 },
      ];
    default: // 1-2-2
      return [
        { position: 'GK', player: null, x: 50, y: 88 },
        { position: 'DEF', player: null, x: 30, y: 65 },
        { position: 'DEF', player: null, x: 70, y: 65 },
        { position: 'FWD', player: null, x: 30, y: 25 },
        { position: 'FWD', player: null, x: 70, y: 25 },
      ];
  }
}
