import { useState, useCallback } from 'react';
import type { Player } from '../types';
import { Search, Sword, Shield, X, Coins, Check } from 'lucide-react';
import { searchPlayers } from '../api';
import PlayerCard from './PlayerCard';

interface DraftMarketProps {
  availablePlayers: Player[];
  ownedPlayerIds: Set<string>;
  coins: number;
  onRecruit: (player: Player) => void;
  loading: boolean;
}

const RARITY_COST: Record<string, number> = {
  common: 100,
  rare: 250,
  epic: 500,
  legendary: 1000,
};

export default function DraftMarket({ availablePlayers, ownedPlayerIds, coins, onRecruit, loading }: DraftMarketProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'anime' | 'football'>('anime');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState<'all' | 'anime' | 'football'>('all');
  const [posFilter, setPosFilter] = useState<'all' | 'GK' | 'DEF' | 'MID' | 'FWD'>('all');

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchPlayers(searchQuery.trim(), searchType);
      setSearchResults(results);
    } catch {
      console.error('Search failed');
    } finally {
      setSearching(false);
    }
  }, [searchQuery, searchType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const displayPlayers = searchResults.length > 0 ? searchResults : availablePlayers;
  const filteredPlayers = displayPlayers.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (posFilter !== 'all' && p.position !== posFilter) return false;
    return true;
  });

  return (
    <div className="page-container">
      <h2 className="section-title">
        Mercado de <span className="highlight">Fichajes</span>
      </h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar personaje de anime o futbolista..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select value={searchType} onChange={(e) => setSearchType(e.target.value as 'anime' | 'football')}>
          <option value="anime">Anime</option>
          <option value="football">Fútbol</option>
        </select>
        <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleSearch} disabled={searching || !searchQuery.trim()}>
          {searching ? '...' : <Search size={16} />}
        </button>
      </div>

      {/* Filters */}
      <div className="filter-chips">
        <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todos</button>
        <button className={`filter-chip ${filter === 'anime' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setFilter('anime')}><Sword size={14} /> Anime</button>
        <button className={`filter-chip ${filter === 'football' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setFilter('football')}><Shield size={14} /> Fútbol</button>
        <span style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
        <button className={`filter-chip ${posFilter === 'all' ? 'active' : ''}`} onClick={() => setPosFilter('all')}>Todas</button>
        <button className={`filter-chip ${posFilter === 'GK' ? 'active' : ''}`} onClick={() => setPosFilter('GK')}>GK</button>
        <button className={`filter-chip ${posFilter === 'DEF' ? 'active' : ''}`} onClick={() => setPosFilter('DEF')}>DEF</button>
        <button className={`filter-chip ${posFilter === 'MID' ? 'active' : ''}`} onClick={() => setPosFilter('MID')}>MID</button>
        <button className={`filter-chip ${posFilter === 'FWD' ? 'active' : ''}`} onClick={() => setPosFilter('FWD')}>FWD</button>
      </div>

      {searchResults.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <button className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => setSearchResults([])}>
            <X size={14} /> Limpiar búsqueda
          </button>
        </div>
      )}

      {loading ? (
        <div>
          <div className="spinner" />
          <div className="loading-text">Cargando jugadores...</div>
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Search size={48} /></div>
          <div className="empty-state-text">No se encontraron jugadores</div>
        </div>
      ) : (
        <div className="player-grid">
          {filteredPlayers.map((player) => {
            const owned = ownedPlayerIds.has(player.id);
            const cost = RARITY_COST[player.rarity] || 100;
            const canAfford = coins >= cost;
            return (
              <div key={player.id} style={{ position: 'relative' }}>
                <PlayerCard
                  player={player}
                  isOwned={owned}
                  showActions={!owned}
                  onRecruit={canAfford ? onRecruit : undefined}
                />
                {!owned && (
                  <div style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '0.8rem',
                    color: canAfford ? 'var(--neon-gold)' : 'var(--danger)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Coins size={14} /> {cost} MC
                  </div>
                )}
                {owned && (
                  <div style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    color: 'var(--neon-green)',
                    fontWeight: 700,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Check size={14} /> En tu equipo
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
