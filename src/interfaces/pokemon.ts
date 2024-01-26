interface NamedAPIResource {
  name: string;
  url: string;
}

interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

interface PokemonForm extends NamedAPIResource {}

interface PokemonGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: PokemonHeldItemVersionDetail[];
}

interface PokemonHeldItemVersionDetail {
  rarity: number;
  version: NamedAPIResource;
}

interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersionGroupDetail[];
}

interface PokemonMoveVersionGroupDetail {
  level_learned_at: number;
  version_group: NamedAPIResource;
  move_learn_method: NamedAPIResource;
}

interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}

interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

interface PokemonSpecies extends NamedAPIResource {}

interface SpriteVersions {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  [key: string]: any; // To cover other sprite versions
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
    };
  };
}

export interface PokemonListAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonItemResult[];
}

export interface PokemonSingleAPIResponse {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: PokemonForm[];
  game_indices: PokemonGameIndex[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: PokemonSpecies;
  stats: PokemonStat[];
  types: PokemonType[];
}

export interface PokemonStatsAPIResponse {
  id: string;
  name: string;
  stats: PokemonStats;
  nextEvolution?: NextEvolution;
  nextEvolutions: NextEvolution[];
}

export interface NextEvolution extends EvolutionData {}

export interface PokemonItemResult extends EvolutionData {}

export interface EvolutionData {
  name: string;
  url: string;
  id: string;
  imageUrl: {
    small: string;
    large: string;
  };
  stats: PokemonStats;
}

interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  weight: number;
}

export interface PokemonSpeciesAPIResponse {
  base_happiness: number;
  capture_rate: number;
  color: NamedAPIResource;
  egg_groups: NamedAPIResource[];
  evolution_chain: {
    url: string;
  };
  evolves_from_species: NamedAPIResource | null;
  flavor_text_entries: FlavorText[];
  form_descriptions: any[]; // Empty in provided data, specify type if known
  forms_switchable: boolean;
  gender_rate: number;
  genera: Genus[];
  generation: NamedAPIResource;
  growth_rate: NamedAPIResource;
  habitat: NamedAPIResource;
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: {
    language: NamedAPIResource;
    name: string;
  }[];
  order: number;
  pal_park_encounters: PalParkEncounter[];
  pokedex_numbers: PokedexNumber[];
  shape: NamedAPIResource;
  varieties: PokemonSpeciesVariety[];
}

interface FlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

interface Genus {
  genus: string;
  language: NamedAPIResource;
}

interface PokedexNumber {
  entry_number: number;
  pokedex: NamedAPIResource;
}

interface PalParkEncounter {
  area: NamedAPIResource;
  base_score: number;
  rate: number;
}

interface PokemonSpeciesVariety {
  is_default: boolean;
  pokemon: NamedAPIResource;
}
