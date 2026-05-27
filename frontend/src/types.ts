export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

export interface SpecialAbility {
  name: string;
  description: string;
  power: number;
}

export interface Player {
  id: string;
  name: string;
  source: string; // anime name or real club
  image: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  nationality: string;
  stats: PlayerStats;
  specialAbility: SpecialAbility;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'anime' | 'football';
  level: number;
  xp: number;
  maxLevel: number;
  overall?: number;
}

export interface TrainingDrill {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  statBoost: {
    stat: keyof PlayerStats;
    amount: number;
  };
  duration: number;
  cost: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'save' | 'foul' | 'special_ability_triggered' | 'injury' | 'substitution_forced' | 'start' | 'half_time' | 'full_time' | 'chance' | 'possession';
  player?: string;
  description: string;
  team?: 'home' | 'away';
}

export interface MatchStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  fouls: number;
  specialAbilities: number;
}

export interface MatchResult {
  score: { home: number; away: number };
  events: MatchEvent[];
  stats: { home: MatchStats; away: MatchStats };
  playerOfTheMatch: Player;
}

export type TabType = 'draft' | 'team' | 'training' | 'match';

export interface LineupSlot {
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  player: Player | null;
  x: number; // percentage position on pitch
  y: number; // percentage position on pitch
}
