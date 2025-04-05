export type Weapon = {
  name: string,
  type: string,
  category: WeaponCategoryEnum,
  attack_type: string,
  enchantable: boolean,
  special: string,
  weight: number,
  durability: number,
  stability: number,
  requirements:{
    strength: number,
    dexterity: number,
    intelligence: number,
    faith: number,
  },
  upgrade:{
    regular:Upgrade[],
    chaos:Upgrade[],
    raw:Upgrade[],
    crystal:Upgrade[],
    divine:Upgrade[],
    occult:Upgrade[],
    lightning:Upgrade[],
    magic:Upgrade[],
    enchanted:Upgrade[],
    fire:Upgrade[]
  }
};


export type Upgrade = {
    level: number,
    scalings: {
      strength: WeaponScalingEnum,
      dexterity: WeaponScalingEnum,
      intelligence: WeaponScalingEnum,
      faith: WeaponScalingEnum
    }
    offensive_stats: {
      physical_damage: number,
      magic_damage: number,
      fire_damage: number,
      lightning_damage: number,
      bleed:number,
      poison:number,
      occult:number,
      divine:number,
      critical:number,
      magic_adjustment: number
    }
    defensive_stats: {
      physical:number,
      magic:number,
      fire:number,
      lightning:number
    }
}


export enum WeaponCategoryEnum {
  AXES = "Axes",
  BOWS = "Bows",
  CATALYST = "Catalyst",
  CROSSBOWS = "Crossbows",
  CURVED_GREATSWORD = "Curved Greatsword",
  CURVED_SWORDS = "Curved Swords",
  DAGGERS = "Daggers",
  FISTS = "Fists",
  GREAT_HAMMERS = "Great Hammers",
  GREATBOWS = "Greatbows",
  GREATSHIELDS = "Greatshields",
  GREATSWORDS = "Greatswords",
  HALBERDS = "Halberds",
  HAMMERS = "Hammers",
  KATANAS = "Katanas",
  LANTERNS = "Lanterns",
  PYROMANCY_FLAMES = "Pyromancy Flames",
  SMALL_SHIELDS = "Small shields",
  STANDARD_SHIELDS = "Standard shields",
  SPEARS = "Spears",
  STRAIGHT_SWORDS = "Straight Swords",
  TALISMAN = "Talisman",
  THRUSTING_SWORDS = "Thrusting Swords",
  ULTRA_GREATSWORD = "Ultra Greatsword",
  WHIPS = "Whips",
}

export enum WeaponScalingEnum {
  S = "S",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  NONE = "−"
}

