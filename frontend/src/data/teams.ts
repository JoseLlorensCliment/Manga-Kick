import type { Player } from '../types';

function createBotPlayer(id: string, name: string, position: 'GK' | 'DEF' | 'MID' | 'FWD', nationality: string, ovr: number): Player {
  // Distribute stats roughly to match the target OVR
  return {
    id,
    name,
    source: nationality,
    image: `https://placehold.co/300x400?text=${encodeURIComponent(name)}`,
    position,
    nationality,
    type: 'football',
    stats: {
      pace: ovr + Math.floor(Math.random() * 10 - 5),
      shooting: position === 'FWD' ? ovr + 5 : ovr - 10,
      passing: position === 'MID' ? ovr + 5 : ovr - 5,
      dribbling: ovr + Math.floor(Math.random() * 10 - 5),
      defense: (position === 'DEF' || position === 'GK') ? ovr + 5 : ovr - 20,
      physical: ovr + Math.floor(Math.random() * 10 - 5),
    },
    specialAbility: { name: 'Fuerza Nacional', description: 'Juega por su país', power: 6 },
    rarity: ovr >= 85 ? 'legendary' : ovr >= 80 ? 'epic' : 'rare',
    level: 1,
    xp: 0,
    maxLevel: 10,
  };
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export const NATIONAL_TEAMS: Team[] = [
  {
    id: 'esp',
    name: 'España',

    players: [
      createBotPlayer('esp-1', 'Unai Simón', 'GK', 'España', 82),
      createBotPlayer('esp-2', 'Carvajal', 'DEF', 'España', 84),
      createBotPlayer('esp-3', 'Laporte', 'DEF', 'España', 83),
      createBotPlayer('esp-4', 'Rodri', 'MID', 'España', 89),
      createBotPlayer('esp-5', 'Morata', 'FWD', 'España', 82),
    ],
  },
  {
    id: 'arg',
    name: 'Argentina',

    players: [
      createBotPlayer('arg-1', 'Dibu Martínez', 'GK', 'Argentina', 85),
      createBotPlayer('arg-2', 'Romero', 'DEF', 'Argentina', 84),
      createBotPlayer('arg-3', 'Otamendi', 'DEF', 'Argentina', 81),
      createBotPlayer('arg-4', 'De Paul', 'MID', 'Argentina', 84),
      createBotPlayer('arg-5', 'Álvarez', 'FWD', 'Argentina', 85), // Assuming Messi is maybe owned by player
    ],
  },
  {
    id: 'bra',
    name: 'Brasil',

    players: [
      createBotPlayer('bra-1', 'Alisson', 'GK', 'Brasil', 89),
      createBotPlayer('bra-2', 'Marquinhos', 'DEF', 'Brasil', 86),
      createBotPlayer('bra-3', 'Militão', 'DEF', 'Brasil', 85),
      createBotPlayer('bra-4', 'Casemiro', 'MID', 'Brasil', 86),
      createBotPlayer('bra-5', 'Rodrygo', 'FWD', 'Brasil', 85),
    ],
  },
  {
    id: 'fra',
    name: 'Francia',

    players: [
      createBotPlayer('fra-1', 'Maignan', 'GK', 'Francia', 87),
      createBotPlayer('fra-2', 'Saliba', 'DEF', 'Francia', 85),
      createBotPlayer('fra-3', 'Upamecano', 'DEF', 'Francia', 82),
      createBotPlayer('fra-4', 'Tchouaméni', 'MID', 'Francia', 84),
      createBotPlayer('fra-5', 'Griezmann', 'FWD', 'Francia', 87),
    ],
  },
  {
    id: 'eng',
    name: 'Inglaterra',

    players: [
      createBotPlayer('eng-1', 'Pickford', 'GK', 'Inglaterra', 82),
      createBotPlayer('eng-2', 'Stones', 'DEF', 'Inglaterra', 84),
      createBotPlayer('eng-3', 'Walker', 'DEF', 'Inglaterra', 84),
      createBotPlayer('eng-4', 'Rice', 'MID', 'Inglaterra', 86),
      createBotPlayer('eng-5', 'Kane', 'FWD', 'Inglaterra', 89),
    ],
  },
  {
    id: 'ger',
    name: 'Alemania',

    players: [
      createBotPlayer('ger-1', 'Neuer', 'GK', 'Alemania', 86),
      createBotPlayer('ger-2', 'Rüdiger', 'DEF', 'Alemania', 86),
      createBotPlayer('ger-3', 'Tah', 'DEF', 'Alemania', 82),
      createBotPlayer('ger-4', 'Gündogan', 'MID', 'Alemania', 85),
      createBotPlayer('ger-5', 'Musiala', 'FWD', 'Alemania', 86),
    ],
  },
  {
    id: 'ita',
    name: 'Italia',

    players: [
      createBotPlayer('ita-1', 'Vicario', 'GK', 'Italia', 83),
      createBotPlayer('ita-2', 'Bastoni', 'DEF', 'Italia', 85),
      createBotPlayer('ita-3', 'Di Lorenzo', 'DEF', 'Italia', 83),
      createBotPlayer('ita-4', 'Barella', 'MID', 'Italia', 86),
      createBotPlayer('ita-5', 'Chiesa', 'FWD', 'Italia', 84),
    ],
  },
  {
    id: 'por',
    name: 'Portugal',

    players: [
      createBotPlayer('por-1', 'Costa', 'GK', 'Portugal', 84),
      createBotPlayer('por-2', 'Dias', 'DEF', 'Portugal', 88),
      createBotPlayer('por-3', 'Cancelo', 'DEF', 'Portugal', 85),
      createBotPlayer('por-4', 'Bruno Fernandes', 'MID', 'Portugal', 88),
      createBotPlayer('por-5', 'Leão', 'FWD', 'Portugal', 85),
    ],
  },
];

export const CLUB_TEAMS: Team[] = [
  {
    id: 'rmd',
    name: 'Real Madrid',

    players: [
      createBotPlayer('rmd-1', 'Courtois', 'GK', 'Bélgica', 89),
      createBotPlayer('rmd-2', 'Rüdiger', 'DEF', 'Alemania', 86),
      createBotPlayer('rmd-3', 'Alaba', 'DEF', 'Austria', 84),
      createBotPlayer('rmd-4', 'Bellingham', 'MID', 'Inglaterra', 90),
      createBotPlayer('rmd-5', 'Vinícius Jr', 'FWD', 'Brasil', 89),
    ],
  },
  {
    id: 'mci',
    name: 'Manchester City',

    players: [
      createBotPlayer('mci-1', 'Ederson', 'GK', 'Brasil', 88),
      createBotPlayer('mci-2', 'Dias', 'DEF', 'Portugal', 88),
      createBotPlayer('mci-3', 'Akanji', 'DEF', 'Suiza', 83),
      createBotPlayer('mci-4', 'De Bruyne', 'MID', 'Bélgica', 91),
      createBotPlayer('mci-5', 'Haaland', 'FWD', 'Noruega', 91),
    ],
  },
  {
    id: 'bar',
    name: 'FC Barcelona',

    players: [
      createBotPlayer('bar-1', 'Ter Stegen', 'GK', 'Alemania', 88),
      createBotPlayer('bar-2', 'Araujo', 'DEF', 'Uruguay', 86),
      createBotPlayer('bar-3', 'Koundé', 'DEF', 'Francia', 84),
      createBotPlayer('bar-4', 'Pedri', 'MID', 'España', 86),
      createBotPlayer('bar-5', 'Lewandowski', 'FWD', 'Polonia', 88),
    ],
  },
  {
    id: 'rai',
    name: 'Raimon Eleven',

    players: [
      createBotPlayer('rai-1', 'Mark Evans', 'GK', 'Japón', 85),
      createBotPlayer('rai-2', 'Jack Wallside', 'DEF', 'Japón', 78),
      createBotPlayer('rai-3', 'Nathan Swift', 'DEF', 'Japón', 80),
      createBotPlayer('rai-4', 'Jude Sharp', 'MID', 'Japón', 86),
      createBotPlayer('rai-5', 'Axel Blaze', 'FWD', 'Japón', 88),
    ],
  },
  {
    id: 'tmz',
    name: 'Team Z',

    players: [
      createBotPlayer('tmz-1', 'Iemon', 'GK', 'Japón', 75),
      createBotPlayer('tmz-2', 'Kuon', 'DEF', 'Japón', 78),
      createBotPlayer('tmz-3', 'Raichi', 'DEF', 'Japón', 81),
      createBotPlayer('tmz-4', 'Bachira', 'MID', 'Japón', 85),
      createBotPlayer('tmz-5', 'Isagi', 'FWD', 'Japón', 87),
    ],
  },
  {
    id: 'nan',
    name: 'Nankatsu SC',

    players: [
      createBotPlayer('nan-1', 'Yuzo Morisaki', 'GK', 'Japón', 74),
      createBotPlayer('nan-2', 'Ryo Ishizaki', 'DEF', 'Japón', 79),
      createBotPlayer('nan-3', 'Hanji Urabe', 'DEF', 'Japón', 77),
      createBotPlayer('nan-4', 'Taro Misaki', 'MID', 'Japón', 86),
      createBotPlayer('nan-5', 'Tsubasa Ozora', 'FWD', 'Japón', 92),
    ],
  },
  {
    id: 'bay',
    name: 'Bayern Munich',

    players: [
      createBotPlayer('bay-1', 'Neuer', 'GK', 'Alemania', 87),
      createBotPlayer('bay-2', 'De Ligt', 'DEF', 'Holanda', 85),
      createBotPlayer('bay-3', 'Davies', 'DEF', 'Canadá', 84),
      createBotPlayer('bay-4', 'Kimmich', 'MID', 'Alemania', 87),
      createBotPlayer('bay-5', 'Musiala', 'FWD', 'Alemania', 86),
    ],
  },
  {
    id: 'psz',
    name: 'Paris SG',

    players: [
      createBotPlayer('psz-1', 'Donnarumma', 'GK', 'Italia', 87),
      createBotPlayer('psz-2', 'Marquinhos', 'DEF', 'Brasil', 86),
      createBotPlayer('psz-3', 'Hakimi', 'DEF', 'Marruecos', 84),
      createBotPlayer('psz-4', 'Vitinha', 'MID', 'Portugal', 83),
      createBotPlayer('psz-5', 'Mbappé', 'FWD', 'Francia', 91),
    ],
  }
];
