export interface PokemonListAPIResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonItemResult[]
}

export interface PokemonSingleAPIResponse {
  id: number
  name: string
  base_experience: number
  height: number
  is_default: boolean
  order: number
  weight: number
  abilities: PokemonAbility[]
  forms: PokemonForm[]
  game_indices: PokemonGameIndex[]
  held_items: PokemonHeldItem[]
  location_area_encounters: string
  moves: PokemonMove[]
  sprites: PokemonSprites
  species: PokemonSpecies
  stats: PokemonStat[]
  types: PokemonType[]
}

export interface PokemonStatsAPIResponse {
  id: string,
  name: string,
  stats: {
    hp: number,
    attack: number,
    defense: number,
    speed: number,
    weight: number,
  }
  nextEvolution: NextEvolution
}

export interface NextEvolution {
  name: string
  url: string
  id: string
  imageUrl: {
    small: string
    large: string
  }
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
    weight: number
  }
}

export interface PokemonItemResult {
  name: string
  url: string
  id: string
  imageUrl: {
    small: string
    large: string
  }
}

interface PokemonAbility {
  is_hidden: boolean
  slot: number
  ability: PokemonAbilityItem
}

interface PokemonAbilityItem {
  name: string
  url: string
}

interface PokemonForm {
  name: string
  url: string
}

interface PokemonGameIndex {
  game_index: number
  version: PokemonGameIndexVersion
}

interface PokemonGameIndexVersion {
  name: string
  url: string
}

interface PokemonHeldItem {
  item: PokemonHeldItemItem
  version_details: PokemonHeldItemVersionDetail[]
}

interface PokemonHeldItemItem {
  name: string
  url: string
}

interface PokemonHeldItemVersionDetail {
  rarity: number
  version: PokemonHeldItemVersionDetailVersion
}

interface PokemonHeldItemVersionDetailVersion {
  name: string
  url: string
}

interface PokemonMove {
  move: PokemonMoveMove
  version_group_details: PokemonMoveVersionGroupDetail[]
}

interface PokemonMoveMove {
  name: string
  url: string
}

interface PokemonMoveVersionGroupDetail {
  level_learned_at: number
  version_group: PokemonMoveVersionGroupDetailVersionGroup
  move_learn_method: PokemonMoveVersionGroupDetailMoveLearnMethod
}

interface PokemonMoveVersionGroupDetailVersionGroup {
  name: string
  url: string
}

interface PokemonMoveVersionGroupDetailMoveLearnMethod {
  name: string
  url: string
}

interface PokemonStat {
  stat: PokemonStatStat
  effort: number
  base_stat: number
}

interface PokemonStatStat {
  name: string
  url: string
}

interface PokemonType {
  slot: number
  type: PokemonTypeType
}

interface PokemonTypeType {
  name: string
  url: string
}

interface PokemonSpecies {
  name: string
  url: string
}

interface SpriteVersions {
  'back_default': string | null;
  'back_female': string | null;
  'back_shiny': string | null;
  'back_shiny_female': string | null;
  'front_default': string | null;
  'front_female': string | null;
  'front_shiny': string | null;
  'front_shiny_female': string | null;
  [key: string]: any;
}

interface PokemonSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other: {
    dream_world: SpriteVersions;
    home: SpriteVersions;
    'official-artwork': SpriteVersions;
    showdown: SpriteVersions;
  };
  versions: {
    [key: string]: {
      [key: string]: SpriteVersions;
    }
  };
}
