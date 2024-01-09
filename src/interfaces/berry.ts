export interface BerryListAPIResponse {
  count: number
  next: string | null
  previous: string | null
  results: BerryItemResult[]
}

interface BerryItemResult {
  name: string
  url: string
  id: string
  imageUrl: {
    small: string
    large: string
  }
}

export interface BerrySingleAPIResponse {
  id: number
  name: string
  growth_time: number
  max_harvest: number
  natural_gift_power: number
  size: number
  smoothness: number
  soil_dryness: number
  firmness: BerryFirmness
  flavors: BerryFlavorMap[]
  item: BerryItem
  natural_gift_type: BerryNaturalGiftType
}

export interface ItemAPIResponse {
  id: number
  name: string
  cost: number
  fling_power: number
  fling_effect: any
  attributes: any[]
  category: any
  effect_entries: any[]
  flavor_text_entries: any[]
  game_indices: any[]
  names: any[]
  sprites: {
    default: string
  }
  held_by_pokemon: any[]
  baby_trigger_for: any
}

interface BerryFirmness {
  name: string
  url: string
}

interface BerryFlavorMap {
  potency: number
  flavor: BerryFlavor
}

interface BerryFlavor {
  name: string
  url: string
}

interface BerryItem {
  name: string
  url: string
}

interface BerryNaturalGiftType {
  name: string
  url: string
}