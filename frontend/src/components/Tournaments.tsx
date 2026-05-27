import { useState } from 'react';
import type { Player } from '../types';
import WorldCup from './WorldCup';
import League from './League';
import { Trophy, Globe, CalendarDays } from 'lucide-react';

interface TournamentsProps {
  playerTeam: Player[];
  onReward: (amount: number) => void;
}

export default function Tournaments({ playerTeam, onReward }: TournamentsProps) {
  const [activeMode, setActiveMode] = useState<'selection' | 'worldcup' | 'league'>('selection');

  if (activeMode === 'worldcup') {
    return <WorldCup playerTeam={playerTeam} onReward={onReward} onBack={() => setActiveMode('selection')} />;
  }

  if (activeMode === 'league') {
    return <League playerTeam={playerTeam} onReward={onReward} onBack={() => setActiveMode('selection')} />;
  }

  return (
    <div className="page-container">
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Trophy className="text-neon-gold" /> Hub de <span className="highlight">Torneos</span>
      </h2>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-2xl)' }}>
        
        {/* World Cup Card */}
        <div 
          className="glass-card clickable-card" 
          style={{ width: '300px', padding: 'var(--space-xl)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
          onClick={() => setActiveMode('worldcup')}
        >
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}><Globe size={64} color="var(--neon-blue)" /></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
            Copa Mundial
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
            Lleva a tu equipo a la gloria enfrentando a las selecciones nacionales.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }}>Jugar Mundial</button>
        </div>

        {/* League Card */}
        <div 
          className="glass-card clickable-card" 
          style={{ width: '300px', padding: 'var(--space-xl)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
          onClick={() => setActiveMode('league')}
        >
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}><CalendarDays size={64} color="var(--neon-green)" /></div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
            Modo Liga
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
            Compite cada semana por puntos y corona a tu equipo como el mejor.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }}>Jugar Liga</button>
        </div>

      </div>
    </div>
  );
}
